import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET as string;
export const refreshSecret = process.env.REFRESH_SECRET as string;

export interface customReq extends Request {
    token: string | JwtPayload;
}

export const createAccessToken = (id: number, email: string) => {
	const token = jwt.sign({
		id,
		email,
	}, secret, { expiresIn: '10m' });
	return token;
};

export const createRefreshToken = (id: number, email: string) => {
	const token = jwt.sign({
		id,
		email,
	}, refreshSecret, { expiresIn: '90d' });
	return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.accessToken;
    
		if (!token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const decodedToken = jwt.verify(token, secret);
		(req as customReq).token = decodedToken;
		next();
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error' });
		console.error(error);
	}
};

// export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const refreshToken = req.cookies.refreshToken;

// 		if (!refreshToken) {
// 			return res.status(401).json({ message: 'Missing refresh token' });
// 		}

// 		const decodedToken = jwt.verify(refreshToken, refreshSecret) as JwtPayload;
// 		console.log(decodedToken.id);

// 		if (!decodedToken) {
// 			return res.status(401).json({ message: 'Invalid refresh token' });
// 		}

// 		const newAccessToken = createAccessToken(decodedToken.id, decodedToken.email);

// 		res.cookie('accessToken', newAccessToken, { maxAge: 1000 * 60 * 7, httpOnly: true, secure: true, sameSite: 'lax' });

// 		next();
// 	} catch (error) {
// 		res.status(500).json({ message: 'Internal Server Error' });
// 		console.error(error);
// 	}
// };