import { Request, Response } from 'express';
import { User } from '../models/model';
import bcrypt from 'bcrypt';
import { createToken } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ where: { email } });

		if (userExists) {
			return res.status(409).json({ message: 'User exists already' });
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
			const token = createToken(user.id, user.email);
			res.cookie('jwtToken', token, { maxAge: 1000 * 60 * 24 * 60, httpOnly: true, secure: true, sameSite: 'lax' });
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
		res.clearCookie('jwtToken');
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};
