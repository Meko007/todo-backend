import { Request, Response } from 'express';
import { User } from '../models/model';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../middleware/auth';
import { isEmail, random, sanitizeText } from '../utils/util';
import { emailAddress, transporter } from '../utils/mail';

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ where: { email } });

		if (userExists) {
			return res.status(409).json({ message: 'User exists already' });
		}

		if (!sanitizeText(name)) {
			return res.status(422).json({ message: 'Your name can\'t contain special characters or numbers besides "-"' });
		}

		if (!isEmail(email)) {
			return res.status(422).json({ message: 'Enter a valid email' });
		}

		const hash = await bcrypt.hash(password, 12);

		const newUser = await User.create({
			name,
			email,
			password: hash,
		});
		res.status(201).json(newUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email: email } });

		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		if (user && (await bcrypt.compare(password, user.password))) {
			const accessToken = createAccessToken(user.id, user.email);
			const refreshToken = createRefreshToken(user.id, user.email);

			res.cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 10, httpOnly: true, secure: true, sameSite: 'lax' });
			res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 90 * 24 * 60, httpOnly: true, secure: true, sameSite: 'lax' });

			res.status(200).json({ message: 'Logged in successfully' });
		} else {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const resetToken = random();

		await User.update({
			resetToken: resetToken,
		},
		{
			where: {
				email: email,
			},
		});

		const mailOptions = {
			from: emailAddress,
			to: email,
			subject: 'Password Reset',
			text: `Click on this link: http://localhost:5000/api/v1/users/reset-password/${resetToken}`,
		};

		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: 'Password reset token sent' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { resetToken } = req.params;
		const { newPassword } = req.body;
		const user = await User.findOne({ where: { resetToken: resetToken } });

		if (!user) {
			return res.status(404).json({ message: 'page not found' });
		}

		const hash = await bcrypt.hash(newPassword, 10);

		await User.update({
			password: hash,
			resetToken: null,
		},
		{
			where: {
				id: user.id,
			}
		});

		res.status(200).json({ message: 'Password reset successful' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};