import { DataTypes, Model } from 'sequelize';
import conn from '../database/db'; 

export interface IUser extends Model {
    id: number;
    name: string;
    email: string;
    password: string;
    resetToken: string | null;
}

export const User = conn.define<IUser>('User', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	resetToken: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
});

export interface ITodo extends Model {
    id: number;
    task: string;
    priority: 'low' | 'medium' | 'high';
    isCompleted: boolean;
    expectedEndDate?: Date;
}

export const Todo = conn.define<ITodo>('Todo', {
	task: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	priority: {
		type: DataTypes.ENUM,
		values: ['low', 'medium', 'high'],
		allowNull: false,
	},
	isCompleted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	expectedEndDate: {
		type: DataTypes.DATE,
	},
});

User.hasMany(Todo, {
	foreignKey: 'userId',
});

Todo.belongsTo(User);


async function syncDB() {
	try {
		await conn.sync();
	} catch (error) {
		console.error(error);
	}
}

syncDB();