"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../lib/modules/auth"));
const router_1 = __importDefault(require("../lib/modules/server/router"));
const user_routes_1 = __importDefault(require("./user.routes"));
const logger_1 = require("../lib/modules/logger");
const task_routes_1 = __importDefault(require("./user.routes/task.routes"));
const useRoutes = ({ app }) => {
    const authenticationRepo = new auth_1.default();
    const router = new router_1.default({ router: app, authenticationRepo, host: '/api' });
    router.extend('/user', user_routes_1.default);
    router.extend('/task', task_routes_1.default);
    // router.extend('/admin', useAdminRoutes, {tokenType: TokenType.adminAccessToken});
    if (process.env.NODE_ENV === 'development')
        logger_1.defaultLogger.checkRoutes(router);
};
exports.default = useRoutes;
