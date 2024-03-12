import { Router } from 'express';
import {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
} from '../controllers/user.controller';

const router = Router();

router.post('/users/register', register);

router.post('/users/login', login);

router.post('/users/logout', logout);

router.post('/users/forgot-password', forgotPassword);

router.post('/users/reset-password/:resetToken', resetPassword);

export default router;