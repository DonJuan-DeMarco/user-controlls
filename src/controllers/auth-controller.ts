import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import validator from 'validator';

const authController = {
	register: async (
		request: Request,
		response: Response,
		next: NextFunction
	) => {
		const { firstname, surname, email, password } = request.body;

		if (!firstname || !surname || !email || !password) {
			return response.status(400).send('Fields are missing.');
		}

		if (!validator.isEmail(email)) {
			return response.status(400).send('Wrong format of email.');
		}

		if (!validator.isLength(password, { min: 6 })) {
			return response.status(400).send('Password is too short.');
		}

		if (
			!validator.isLength(firstname, { min: 1 }) ||
			!validator.isLength(surname, { min: 1 })
		) {
			return response.status(400).send('Name is too short.');
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return response.status(422).send('User exist.');
		} else {
			const hashedPassword = await bcrypt.hash(
				password,
				+process.env.SALT!
			);

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

			return response.status(201).send('User created.');
		}
	},

	login: async (request: Request, response: Response, next: NextFunction) => {
		const { email, password } = request.body;
		if (!email || !password) {
			return response.status(400).send('Fields are missing.');
		}
		if (!validator.isEmail(email)) {
			return response.status(400).send('Wrong format of email.');
		}

		if (!validator.isLength(password, { min: 6 })) {
			return response.status(400).send('Password is too short.');
		}
		const existingUser = await User.findOne({ email });
		if (!existingUser) return response.status(404).send('User not found.');

		const passwordMatch = await bcrypt.compare(
			password,
			existingUser?.password
		);

		if (!passwordMatch) {
			return response.status(401).send('Invalid credentials.');
		}

		try {
			const token = jwt.sign(
				{ email: email, id: existingUser.id },
				process.env.ACCESS_TOKEN_PRIVATE_KEY!,
				{ expiresIn: '1d' }
			);

			return response.json({ token });
		} catch (err) {
			return response.status(500).send('Login failed.');
		}
	},
};
export default authController;
