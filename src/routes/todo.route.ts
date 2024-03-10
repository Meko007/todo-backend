import { Router } from 'express';
import {
	createTodo,
	getTodos,
	getTodoById,
	deleteTodo,
} from '../controllers/todo.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

router.route('/todos')
	.post(createTodo)
	.get(getTodos);

router.route('/todos/:id')
	.get(getTodoById)
	.delete(deleteTodo);

export default router;