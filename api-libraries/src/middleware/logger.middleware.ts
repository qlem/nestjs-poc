import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils';

@Injectable()
class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ref = Date.now();
    const logMessage = (time: number) =>
      `${req.method} ${req.originalUrl || req.url} ${res.statusCode} ${time}ms`;
    if (res.headersSent) {
      logger.info(logMessage(Date.now() - ref));
    } else {
      res.on('finish', () => {
        logger.info(logMessage(Date.now() - ref));
      });
    }
    next();
  }
}

export default LoggerMiddleware;
