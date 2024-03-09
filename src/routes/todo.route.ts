import { Router } from 'express';
import {
	createTodo,
	getTodos,
} from '../controllers/todo.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

router.route('/todos')
	.post(createTodo)
	.get(getTodos);

export default router;