import { Router } from 'express';
import { refreshAccessToken } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/auth/refresh-token', refreshAccessToken);

export default router;