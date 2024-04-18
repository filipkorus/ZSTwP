import {Request, Response} from 'express';
import {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS} from '../../utils/httpCodeResponses/messages';
import {getUserById} from './user.service';

export const GetUserHandler = async (req: Request, res: Response) => {
	const {password, ...rest} = res.locals.user; // password hash cannot be sent to browser

	return SUCCESS(res, 'Success', {user: rest});
};

export const GetUserByIdHandler = async (req: Request, res: Response) => {
	const {id: userId} = req.params;

	if (userId == null || !Number.isInteger(Number(userId))) {
		return BAD_REQUEST(res, 'Invalid or missing \'userId\' param');
	}

	const user = await getUserById(+userId);
	if (user == null) {
		return NOT_FOUND(res, `User with ID = ${userId} does not exist`);
	}

	const {banned, email, password, ...rest} = user;

	return SUCCESS(res, 'User data fetched successfully', {user: rest});
};
