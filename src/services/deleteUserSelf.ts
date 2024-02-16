import User from '../models/user';

export const deleteUserSelf = async (userId: string) => {
	try {
		const users = await User.findByIdAndDelete(userId);
		return users;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
