import { Request, Response } from 'express';
import { Todo } from '../models/model';
import { customReq } from '../middleware/auth';
import { JwtPayload } from 'jsonwebtoken';
import { Op } from 'sequelize';

export const createTodo = async (req: Request, res: Response) => {
	try {
		const userId = ((req as customReq).token as JwtPayload).id;
		const { task, priority, expectedEndDate } = req.body;

		if (expectedEndDate && new Date(expectedEndDate) < new Date()) {
            return res.status(422).json({ message: 'Expected end date cannot be in the past' });
        }

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
	interface conditions {
		task?: { [Op.iLike]: string };
		expectedEndDate?: { [Op.between]: Date[] };
		priority?: string;
	}

	try {
		const { sortBy = 'id', sortOrder = 'asc', search, startDate, endDate, priority, page = 1 } = req.query;
		const userId = ((req as customReq).token as JwtPayload).id;

		const where: conditions = {};

		if (search) {
			where.task = { [Op.iLike]: `%${search}%` };
		}

		if (startDate || endDate) {
			where.expectedEndDate = {
				[Op.between]: [new Date(startDate as string), new Date(endDate as string)],
			};
		}

		if (priority) {
			where.priority = priority as string;
		}

		const todos = await Todo.findAll({ 
			where: {
				UserId: userId,
				...where,
			},
			order: [[
				sortBy as string,
				sortOrder as string,
			]],
			limit: 10,
			offset: (Number(page) - 1) * 10, 
		});
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
		
		const todo = await Todo.findOne({
			where: {
				id: id,
				UserId: userId,
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
		const userId = ((req as customReq).token as JwtPayload).id;
		const { id } = req.params;
		const { task, priority, isCompleted, expectedEndDate } = req.body;

		const todoExists = await Todo.findOne({
			where: {
				id: id,
				UserId: userId,
			},
		});

		
		if (!todoExists) {
			return res.status(404).json({ message: 'Todo not found' });
		}
		
		await Todo.update({
			task: task ? task : undefined,
			priority: priority ? priority : undefined,
			isCompleted: isCompleted ? isCompleted : undefined,
			expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : undefined,
		},
		{
			where: {
				id: id,
				UserId: userId,
			},
		});

		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });      
	}
};

export const deleteTodo = async (req: Request, res: Response) => {
	try {
		const userId = ((req as customReq).token as JwtPayload).id;
		const { id } = req.params;
		
		const todoExists = await Todo.findOne({
			where: {
				id: id,
				UserId: userId,
			},
		});
        
		if (!todoExists) {
			return res.status(404).json({ message: 'Todo not found' });
		}

		await Todo.destroy({
			where: {
				id: id,
				UserId: userId,
			},
		});
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });      
	}
};


