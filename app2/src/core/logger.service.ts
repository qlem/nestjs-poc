import { Injectable, Logger, Scope } from '@nestjs/common';

import { logger } from '../utils';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  error(message: any, trace?: string, context?: string) {
    logger.error(trace || message);
  }

  log(message: any, context?: string) {
    logger.info(message);
  }

  warn(message: any, context?: string) {
    logger.warn(message);
  }

  debug(message: any, context?: string) {
    logger.debug(message);
  }

  verbose(message: any, context?: string) {
    logger.trace(message);
  }
}
