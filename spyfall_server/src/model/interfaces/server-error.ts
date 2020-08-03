import * as Errors from '../../errors';

export type ServerError =
	Errors.TeapotError |
	Errors.InternalServerError |
	Errors.BadRequestError |
	Errors.ForbiddenError |
	Errors.NotFoundError |
	Errors.UnauthorizedError;
