import pino from 'pino';

const levels = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'FATAL',
};

const logger = pino({
  level: 'info',
  prettyPrint: process.env.NODE_ENV
    ? process.env.NODE_ENV === 'development'
    : true,
  prettifier:
    () =>
    ({ level, msg }: { level: number; msg: string }) =>
      `${levels[level]}: ${msg}\n`,
});

export default logger;
