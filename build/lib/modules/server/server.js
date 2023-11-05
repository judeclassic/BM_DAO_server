"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../constant/config"));
const logger_1 = require("../logger");
class HttpServer {
    constructor({ app }) {
        this.close = () => {
            this.httpsServer.close();
        };
        this.options = config_1.default.options;
        this.port = config_1.default.server.port;
        this.app = app;
        this.logger = logger_1.defaultLogger;
        this.test(app);
    }
    test(app) {
        app.get('/test', (_req, res) => {
            res.send('server running successfully and this is test');
        });
    }
    production() {
        const https = require('httpolyglot');
        const fs = require('fs');
        const options = {
            key: fs.readFileSync(this.options.key),
            cert: fs.readFileSync(this.options.cert)
        };
        this.httpsServer = https.createServer(options, this.app);
        this.httpsServer.listen(this.port, () => this.logger.init(`Server in Production Mode and Listening on port ${this.port}`));
        return this.httpsServer;
    }
    development() {
        const http = require('http');
        this.httpsServer = http.createServer(this.app);
        this.httpsServer.listen(this.port, () => this.logger.init(`Server in Development Mode and Listening on port ${this.port}`));
        return this.httpsServer;
    }
}
exports.default = HttpServer;
