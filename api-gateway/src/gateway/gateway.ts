import { introspectSchema } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { AsyncExecutor, ExecutionParams } from '@graphql-tools/utils';
import { GraphQLSchema, print } from 'graphql';
import axios from 'axios';

import { logger } from '../utils';
import { API_BOOKS_URL, API_LIBRARIES_URL } from '../config';

const makeRemoteExecutor = ({ url }: { url: string }): AsyncExecutor => {
  return async ({ document, variables, context }: ExecutionParams) => {
    const token =
      context && context.request && context.request.header && context.request.header.authorization;
    const headers = token ? { Authorization: token } : undefined;
    const query = print(document);

    try {
      const { data } = await axios({
        method: 'POST',
        data: { query, variables },
        headers,
        url: `${url}/graphql`,
      });
      return data;
    } catch (err) {
      logger.error(`Unexpected error while introspection at ${url}/graphql`);
      throw new Error('Server Internal Error');
    }
  };
};

const makeGatewaySchema = async (): Promise<GraphQLSchema> => {
  const apiBooks = makeRemoteExecutor({ url: API_BOOKS_URL as string });
  const apiLibraries = makeRemoteExecutor({ url: API_LIBRARIES_URL as string });

  return stitchSchemas({
    subschemas: [
      {
        schema: await introspectSchema(apiBooks),
        executor: apiBooks,
      },
      {
        schema: await introspectSchema(apiLibraries),
        executor: apiLibraries,
      },
    ],
    typeDefs: 'type Query { heartbeat: String! }',
    resolvers: {
      Query: {
        heartbeat: () => 'OK',
      },
    },
  });
};

export default makeGatewaySchema;
