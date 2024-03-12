import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.route';
import user from './routes/user.route';
import todo from './routes/todo.route';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use('/api/v1', auth);
app.use('/api/v1', user);
app.use('/api/v1', todo);
app.use(cors({
	credentials: true,
}));

const port = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
	res.send('Todo');
});

app.listen(port, () => {
	console.log(`server is listening on port ${port}`);
});