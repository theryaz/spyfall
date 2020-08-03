import { logger, loadEnvs } from '../shared';
import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../model/interfaces';

const { NODE_ENV } = loadEnvs(['NODE_ENV'], false);

export function errorHandler(error: ServerError, _: Request, res: Response , next: NextFunction){
  if(error){
    let message = NODE_ENV === 'production' ? error.statusMessage : (error.message || error.statusMessage);
    logger.error(`Error handled [${error.status}]: ${message}`);
    console.error(error);
    res.status(error.status || 500).json({
        result: {
        message: message,
        payload: error.payload
      }
    });
    return;
  }
  next();
};
