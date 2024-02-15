import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user';

const authController = {
	register: async (
		request: Request,
		response: Response,
		next: NextFunction
	) => {
		const { firstname, surname, email, password } = request.body;

		if (!surname || !firstname || !email || !password) {
			return response
				.status(400)
				.send('Username and password are required.');
		}

		const existingUser = await User.findOne({ email });

		request.body.existingUser = existingUser;

		if (existingUser) {
			next();
		} else {
			const hashedPassword = await bcrypt.hash(
				password,
				+process.env.SALT!
			);

			let role = null;

			try {
				const count = await User.countDocuments({});
				if (count < 1) role = 'admin';
			} catch (err) {
				console.error(err);
			}

			const registeredUser = new User({
				firstname,
				surname,
				email,
				password: hashedPassword,
			});

			try {
				request.body.existingUser = await registeredUser.save();
			} catch (err) {
				return response
					.status(500)
					.send('Registration of user failed.');
			}

			next();
		}
	},

	// login: async (request, response, next) => {
	// 	const { username, password, existingUser } = request.body;

	// 	const passwordMatch = await bcrypt.compare(
	// 		password,
	// 		existingUser?.password
	// 	);

	// 	if (!passwordMatch) {
	// 		return response.status(401).send('Invalid credentials.');
	// 	}

	// 	try {
	// 		const token = jwt.sign(
	// 			{ username: existingUser.username, id: existingUser.id },
	// 			process.env.ACCESS_TOKEN_PRIVATE_KEY,
	// 			{ expiresIn: '1d' }
	// 		);

	// 		return response.json({ token });
	// 	} catch (err) {
	// 		return response.status(500).send('Login failed.');
	// 	}
	// },
};
export default authController;
