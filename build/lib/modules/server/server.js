"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpServer {
    constructor({ app, config, logger }) {
        this.close = () => {
            this.httpsServer.close();
        };
        this.options = config.options;
        this.port = config.server.port;
        this.app = app;
        this.logger = logger;
        this.test(app);
    }
    test(app) {
        app.get('/test', (_req, res) => {
            res.send('server started');
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
