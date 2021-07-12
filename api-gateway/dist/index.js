"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const apollo_server_koa_1 = require("apollo-server-koa");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const dotenv = __importStar(require("dotenv"));
const config_1 = require("./config");
const gateway_1 = __importDefault(require("./gateway"));
const middlewares_1 = require("./middlewares");
const utils_1 = require("./utils");
dotenv.config();
console.log('NODE_ENV', process.env.NODE_ENV);
// init Koa app
const app = new koa_1.default();
(async () => {
    // init Apollo Server
    const server = new apollo_server_koa_1.ApolloServer({
        schema: await gateway_1.default(),
        context: ({ ctx }) => ctx,
        introspection: true,
    });
    // use Koa app as middleware
    server.applyMiddleware({ app, path: '/graphql' });
    // start server
    if (config_1.NODE_ENV !== 'test') {
        app.use(middlewares_1.queryLogger);
        app.use(koa_bodyparser_1.default());
        app.use((ctx, next) => {
            ctx.body = ctx.request.body;
            return next();
        });
        app.listen(config_1.PORT, async () => {
            utils_1.logger.info(`API gateway listening at http://localhost:${config_1.PORT}${server.graphqlPath}`);
        });
    }
})();
//# sourceMappingURL=index.js.map