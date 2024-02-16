import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../types/api';

export default function checkAuthToken(
	request: RequestWithUser,
	response: Response,
	next: NextFunction
) {
	const token = request.headers.authorization;

	if (!token) {
		response.writeHead(401, { 'Content-Type': 'application/json' });
		response.end(JSON.stringify({ message: 'No token provided' }));
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY!, (err, user) => {
		if (err) {
			response.writeHead(403, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ message: 'Invalid token' }));
			return;
		}
		request.user = user;
		next();
	});
}
