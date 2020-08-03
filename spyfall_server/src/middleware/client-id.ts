import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';

/**
*	Load SocketIO Client ID from header
*/
export async function loadClientId(req: Request, res: Response, next: NextFunction){
  res.locals.clientId = req.headers['x-client-id'];
  if(!res.locals.clientId) throw new BadRequestError("Socket.io Connection Id is required (x-client-id header)");
  next();
}