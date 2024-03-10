import { Request, Response } from 'express';
import { Todo } from '../models/model';
import { customReq } from '../middleware/auth';
import { JwtPayload } from 'jsonwebtoken';

export const createTodo = async (req: Request, res: Response) => {
	try {
		const userId = ((req as customReq).token as JwtPayload).id;
		const { task, priority, expectedEndDate } = req.body;

		const newTodo = await Todo.create({
			UserId: userId,
			task,
			priority,
			expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : undefined,
		});
		res.status(201).json(newTodo);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });      
	}
};

export const getTodos = async (req: Request, res: Response) => {
	try {
		const userId = ((req as customReq).token as JwtPayload).id;
		const todos = await Todo.findAll({ where: { userId: userId } });
		res.status(200).json(todos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });      
	}
};

export const getTodoById = async (req: Request, res: Response) => {
	try {
		const userId = ((req as customReq).token as JwtPayload).id;
		const { id } = req.params;
		
		const todo = Todo.findOne({
			where: {
				id: id,
				userId: userId,
			},
		});

		if (!todo) {
			return res.status(404).json({ message: 'Todo not found' });
		}

		res.status(200).json(todo);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });      
	}
};

export const updateTodo = async (req: Request, res: Response) => {
	try {
        
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });      
	}
};

export const deleteTodo = async (req: Request, res: Response) => {
	try {
		const userId = ((req as customReq).token as JwtPayload).id;
		const { id } = req.params;
		
		const todoExists = await Todo.findByPk(id);
        
		if (!todoExists) {
			return res.status(404).json({ message: 'Todo not found' });
		}

		await Todo.destroy({
			where: {
				id: id,
				userId: userId,
			},
		});
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });      
	}
};


