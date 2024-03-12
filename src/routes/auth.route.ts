import { Router } from 'express';
import { refreshAccessToken } from '../controllers/auth.controller';

const router = Router();

router.post('/auth/refresh-token', refreshAccessToken);

export default router;