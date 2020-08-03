import express from 'express';
import { logger } from '../shared';

export function logRoute(req: express.Request, _: express.Response, next: express.NextFunction){
  logger.info(`[${req.ip}] ${req.method} ${req.path}`);
  next();
}
