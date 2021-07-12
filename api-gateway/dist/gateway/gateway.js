"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrap_1 = require("@graphql-tools/wrap");
const stitch_1 = require("@graphql-tools/stitch");
const graphql_1 = require("graphql");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const config_1 = require("../config");
const makeRemoteExecutor = ({ url }) => {
    console.log('url', url);
    console.log('urls', config_1.API_BOOKS_URL, config_1.API_LIBRARIES_URL);
    return async ({ document, variables, context }) => {
        const token = context && context.request && context.request.header && context.request.header.authorization;
        const headers = token ? { Authorization: token } : undefined;
        const query = graphql_1.print(document);
        try {
            const { data } = await axios_1.default({
                method: 'POST',
                data: { query, variables },
                headers,
                url: `${url}/graphql`,
            });
            return data;
        }
        catch (err) {
            utils_1.logger.error(`Unexpected error while introspection at ${url}/graphql`);
            throw new Error('Server Internal Error');
        }
    };
};
const makeGatewaySchema = async () => {
    const apiBooks = makeRemoteExecutor({ url: config_1.API_BOOKS_URL });
    const apiLibraries = makeRemoteExecutor({ url: config_1.API_LIBRARIES_URL });
    return stitch_1.stitchSchemas({
        subschemas: [
            {
                schema: await wrap_1.introspectSchema(apiBooks),
                executor: apiBooks,
            },
            {
                schema: await wrap_1.introspectSchema(apiLibraries),
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
exports.default = makeGatewaySchema;
//# sourceMappingURL=gateway.js.map