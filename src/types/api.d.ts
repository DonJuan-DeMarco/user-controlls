import { Request, Response } from 'express';

export interface RequestWithUser extends Request {
	user?: any;
}
