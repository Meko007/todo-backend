import { Router } from 'express';
import {
	register,
	login,
	logout,
} from '../controllers/user.controller';

const router = Router();

router.post('/users/register', register);
router.post('/users/login', login);
router.post('/users/logout', logout);

export default router;