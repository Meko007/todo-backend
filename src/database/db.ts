import { Sequelize } from 'sequelize';
import 'dotenv/config';

const database = process.env.DB_NAME as string;
const user = process.env.DB_USER as string;
const password = process.env.DB_PASS as string;
const port = Number(process.env.DB_PORT);
const host = process.env.DB_HOST as string;

const sequelize = new Sequelize({
	database: database,
	username: user,
	password: password,
	port: port,
	host: host,
	dialect: 'postgres',
});

async function testConn() {
	try {
		await sequelize.authenticate();
		console.log('connected to PostgreSQL');
	} catch (error) {
		console.error(error);
	}
}

testConn();

export default sequelize;