import { NextFunction, Request, Response } from 'express';
import { getUsersAllService } from '../services/getAllUsers';
import { RequestWithUser } from '../types/api';
import { deleteUserSelf } from '../services/deleteUserSelf';

const userController = {
	all: async (request: Request, response: Response, next: NextFunction) => {
		const users = await getUsersAllService();
		console.log(users);
		return response.status(200).json(users);
	},
	deleteSelf: async (
		request: RequestWithUser,
		response: Response,
		next: NextFunction
	) => {
		console.log(request.user);
		deleteUserSelf(request.user.id);
		return response
			.status(200)
			.json({ message: 'User performed seppuku successfully' });
	},
};
export default userController;
