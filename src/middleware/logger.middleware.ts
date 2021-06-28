import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils';

@Injectable()
class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    logger.info(`${req.method} - ${req.originalUrl}`);
    next();
  }
}

export default LoggerMiddleware;
