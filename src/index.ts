import express, { Express } from 'express';

import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth-routes';
import userRoutes from './routes/user-routes';
import checkAuthToken from './middlewares/checkAuthToken';

const app: Express = express();

app.use(cors());
app.use(bodyParser.json({}));
app.use('/api/auth', authRoutes);
app.use('/api/user', checkAuthToken, userRoutes);

const server = http.createServer(app);

mongoose
	.connect(`${process.env.MONGODB_CONNECTION}`)
	.then(() => {
		server.listen(8000, () => {
			console.log('Running on port 8000');
		});
	})
	.catch((error) => {
		console.log(`Could not connect to DB\n${error}`);
	});
