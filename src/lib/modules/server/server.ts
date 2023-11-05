import LoggerInterface from "../../../types/interfaces/logger";
import config from "../../constant/config";
import { defaultLogger } from "../logger";

export default class HttpServer {
    logger: LoggerInterface;
    options: any;
    port: number | string;
    app: any;
    httpsServer: any;
    
    constructor({app}:{app: any}) {
        this.options = config.options;
        this.port = config.server.port;
        this.app = app;
        this.logger = defaultLogger;
        this.test(app);
    }

    private test(app: any) {
        app.get('/test', (_req: any, res: any) =>{
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

    close = () => {
        this.httpsServer.close();
    }
}