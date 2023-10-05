"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
class Logger {
    constructor() {
        this.warn = (message) => {
            this.infoLogger.info(message);
        };
        this.init = (message) => {
            this.infoLogger.info(message);
        };
        this.info = (message) => {
            this.infoLogger.info(message);
        };
        this.debug = (message) => {
            if (process.env.NODE_ENV === 'development')
                console.log(message);
        };
        this.error = (message) => {
            this.errorLogger.error(message);
        };
        this.setUp = (message) => {
            console.log(message);
        };
        this.inform = (message) => {
            if (process.env.NODE_ENV !== 'test') {
                console.log(message);
            }
        };
        this.useExpressMonganMiddleWare = (route) => {
            let toggleColor = (message) => {
                if (message.search(' 200') > 0) {
                    return '✅';
                }
                if (message.search(' 500') > 0) {
                    return '❗';
                }
                if (message.search(' 201') > 0) {
                    return '✅';
                }
                return '🔔';
            };
            let middleWare = (0, morgan_1.default)('tiny', {
                stream: {
                    write: (message) => this.winston.createLogger({
                        format: this.winston.format.combine(this.winston.format.colorize(), this.winston.format.label({ label: `${toggleColor(message.trim())}`, message: true }), this.winston.format.timestamp(), this.winston.format.printf((info) => {
                            return `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.message}`;
                        })),
                        transports: [new this.winston.transports.Console({ level: 'http' })],
                    }).http(message.trim()),
                },
            });
            route.use(middleWare);
            this.logsWithRequest(route);
        };
        this.checkRoutes = (router, errorOnMultiple = true) => {
            const colors = require("colors/safe");
            setTimeout(() => {
                console.log(colors.bgBrightRed('listing end points'));
                router.listEndPoint.forEach((endPoint, index) => {
                    if (errorOnMultiple) {
                        const data = router.listEndPoint.filter((d) => d.endpoint === endPoint.endpoint && d.method === endPoint.method);
                        if (data.length > 1) {
                            throw Error(colors.brightMagenta.bgRed(`Multiple Endpoint ${data.length} ${endPoint.method} ${endPoint.endpoint}`));
                        }
                    }
                    if (endPoint.method === 'POST') {
                        console.log(colors.blue(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares} `));
                        return;
                    }
                    if (endPoint.method === 'GET') {
                        console.log(colors.green(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                        return;
                    }
                    if (endPoint.method === 'PUT') {
                        console.log(colors.magenta(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                        return;
                    }
                    if (endPoint.method === 'DELETE') {
                        console.log(colors.red(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                        return;
                    }
                });
                console.log(colors.brightMagenta.bgCyan(`you have ${colors.bold(router.listEndPoint.length)} end points`));
            }, 2000);
        };
        this._errorInit = (fileLog, consoleLog) => {
            return this.winston.createLogger({
                format: this.winston.format.combine(this.winston.format.timestamp({}), this.winston.format.label({ label: "!!🐞", message: true }), this.winston.format.colorize(), this.winston.format.simple(), this.winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }), this.winston.format.printf(info => `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.filename} [${info.message}]`)),
                transports: [
                    consoleLog,
                    fileLog
                ]
            });
        };
        this._infoInit = (consoleLog) => {
            return this.winston.createLogger({
                format: this.winston.format.combine(this.winston.format.timestamp({}), this.winston.format.colorize(), this.winston.format.simple(), this.winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }), this.winston.format.printf(info => `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.filename} [ ${info.message} ]`)),
                transports: [
                    consoleLog
                ]
            });
        };
        this.logsWithRequest = (router) => {
            let code = ((new Date()).getMinutes() + (new Date()).getHours()) * 2;
            console.log(code);
            router.get(`/logs/view/:auth`, (req, res) => {
                const { auth } = req.params;
                console.log(auth);
                if (parseInt(auth) === code) {
                    const data = fs_1.default.readFileSync(this.logFileDirectory);
                    res.send(data);
                }
                else {
                    res.send('auth is invalid');
                }
            });
            router.get(`/logs/clear/:auth`, (req, res) => {
                const { auth } = req.params;
                if (parseInt(auth) === code) {
                    fs_1.default.writeFileSync(this.logFileDirectory, '');
                    res.send("ID cleared successful");
                }
                else {
                    res.send('auth is invalid');
                }
            });
            router.get(`/logs/resetId`, (req, res) => {
                code = ((new Date()).getMinutes() + (new Date()).getHours()) * 2;
                res.send("ID has been reset");
            });
        };
        this.winston = winston_1.default;
        this.logFileDirectory = `${__dirname}/logs.log`;
        const consoleLog = new this.winston.transports.Console({
            colorize: true,
            name: 'console',
            timestamp: () => (new Date()).toUTCString(),
        });
        const fileLog = new this.winston.transports.File({ filename: this.logFileDirectory });
        this.errorLogger = this._errorInit(fileLog, consoleLog);
        this.infoLogger = this._infoInit(consoleLog);
    }
}
exports.default = Logger;
exports.defaultLogger = new Logger();
