import { Router } from 'express';
import {
	createTodo,
	getTodos,
	getTodoById,
	updateTodo,
	deleteTodo,
} from '../controllers/todo.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.route('/todos')
	.post(verifyToken, createTodo)
	.get(verifyToken, getTodos);

router.route('/todos/:id')
	.get(verifyToken, getTodoById)
	.put(verifyToken, updateTodo)
	.delete(verifyToken, deleteTodo);

export default router;