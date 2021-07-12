import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import bodyParser from 'koa-bodyparser';

import { NODE_ENV, PORT } from './config';
import makeGatewaySchema from './gateway';
import { queryLogger } from './middlewares';
import { logger } from './utils';

// init Koa app
const app = new Koa();

(async () => {
  // init Apollo Server
  const server = new ApolloServer({
    schema: await makeGatewaySchema(),
    context: ({ ctx }) => ctx,
    introspection: true,
  });

  // use Koa app as middleware
  server.applyMiddleware({ app, path: '/graphql' });

  // start server
  if (NODE_ENV !== 'test') {
    app.use(queryLogger);
    app.use(bodyParser());
    app.use((ctx, next) => {
      ctx.body = ctx.request.body;
      return next();
    });
    app.listen(PORT, async () => {
      logger.info(`API gateway is running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  }
})();
