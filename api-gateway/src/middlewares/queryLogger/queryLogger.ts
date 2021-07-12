import { Context, Next } from 'koa';

import { logger } from '../../utils';

const queryLogger = async (ctx: Context, next: Next): Promise<void> => {
  const start = Date.now();
  await next();
  logger.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${Date.now() - start}ms`);
};

export default queryLogger;
