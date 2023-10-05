"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./lib/modules/server/index"));
const db_1 = __importDefault(require("./lib/modules/db"));
const config_1 = __importDefault(require("./lib/constant/config"));
const logger_1 = require("./lib/modules/logger");
const load_env_1 = __importDefault(require("./lib/constant/load-env"));
const auth_1 = __importDefault(require("./lib/modules/auth"));
const router_1 = __importDefault(require("./lib/modules/server/router"));
const user_routes_1 = __importDefault(require("./features/user/user.routes"));
(0, load_env_1.default)();
const dBConnection = new db_1.default(logger_1.defaultLogger);
dBConnection.connect({ config: config_1.default });
const callback = (app, server) => {
    const authenticationRepo = new auth_1.default();
    const router = new router_1.default({ router: app, authenticationRepo, host: '/api' });
    router.extend('/user', user_routes_1.default);
    if (process.env.NODE_ENV === 'development')
        logger_1.defaultLogger.checkRoutes(router);
    if (process.env.NODE_ENV === 'development')
        logger_1.defaultLogger.useExpressMonganMiddleWare(app);
};
module.exports = (0, index_1.default)(callback);
