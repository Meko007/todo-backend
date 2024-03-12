import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createAccessToken, refreshSecret } from '../middleware/auth';

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Missing refresh token' });
        }

        const decodedToken = jwt.verify(refreshToken, refreshSecret) as { id: number; email: string };

        if (!decodedToken) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

        const newAccessToken = createAccessToken(decodedToken.id, decodedToken.email);

        res.cookie('accessToken', newAccessToken, { maxAge: 1000 * 60 * 10, httpOnly: true, secure: true, sameSite: 'lax' });

        res.status(200).json({ message: 'Access token refreshed' });
    } catch (error) {
        console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
    }
};