import express, { Express } from 'express';

import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app: Express = express();

app.use(cors());
app.use(bodyParser.json({}));

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
