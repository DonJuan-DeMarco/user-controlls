import User from '../models/user';

export const getUsersAllService = async () => {
	try {
		const users = await User.find().select('-password');
		return users;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
