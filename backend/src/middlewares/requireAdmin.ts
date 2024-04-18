import {NextFunction, Response, Request} from 'express';
import {FORBIDDEN} from '../utils/httpCodeResponses/messages';

const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
	if (res.locals.user.admin) {
		return next();
	}

	return FORBIDDEN(res);
};

export default requireAdmin;
