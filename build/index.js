"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./lib/modules/server/index"));
const db_1 = __importDefault(require("./lib/modules/db"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = __importDefault(require("./lib/constant/config"));
const logger_1 = require("./lib/modules/logger");
const load_env_1 = __importDefault(require("./lib/constant/load-env"));
(0, load_env_1.default)();
const dBConnection = new db_1.default(logger_1.defaultLogger);
dBConnection.connect({ config: config_1.default });
const callback = (app, server) => {
    if (process.env.NODE_ENV === 'development')
        logger_1.defaultLogger.useExpressMonganMiddleWare(app);
    (0, routes_1.default)({ app });
};
module.exports = (0, index_1.default)({ logger: logger_1.defaultLogger, config: config_1.default, callback });
