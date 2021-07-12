"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const queryLogger = async (ctx, next) => {
    const start = Date.now();
    await next();
    utils_1.logger.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${Date.now() - start}ms`);
};
exports.default = queryLogger;
//# sourceMappingURL=queryLogger.js.map