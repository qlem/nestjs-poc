import pino from 'pino';

import { NODE_ENV } from '../config';

const levels: { [key: number]: string } = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'FATAL',
};

const logger = pino({
  level: 'info',
  prettyPrint: NODE_ENV ? NODE_ENV === 'development' : true,
  prettifier:
    () =>
    ({ level, msg }: { level: number; msg: string }) =>
      `${levels[level]}: ${msg}\n`,
});

export default logger;
