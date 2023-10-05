"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../../types/interfaces/modules/auth");
const ERROR_OCCURED = {
    message: 'Error occured please check your request and try again',
};
class RequestHandler {
    constructor({ router, authenticationRepo, host, tokenType }) {
        this.endPointList = [];
        this._recordEndpoint = (path, method, middleWare) => {
            this.endPointList.push({
                endpoint: `${this.host}${path}`,
                method: method,
                middleWares: middleWare
            });
        };
        this._post = (path, ...args) => {
            const host = `${this.host}${path}`;
            return this.router.post(host, ...args);
        };
        this._get = (path, ...args) => {
            const host = `${this.host}${path}`;
            return this.router.get(host, ...args);
        };
        this._put = (path, ...args) => {
            const host = `${this.host}${path}`;
            return this.router.put(host, ...args);
        };
        this._delete = (path, ...args) => {
            const host = `${this.host}${path}`;
            return this.router.delete(host, ...args);
        };
        this._authenticate = () => {
            return (req, res, next) => {
                try {
                    const response = this.authenticationRepo.verifyBearerToken(req.headers["authorization"], this.tokenType);
                    if (response.status === false) {
                        return res.status(403).json({
                            status: response.status,
                            code: 403,
                            noToken: true,
                            error: response.error,
                        });
                    }
                    req.user = response.data;
                    return next();
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        noToken: true,
                        error: error
                    });
                }
            };
        };
        this.verifyKey = () => {
            return (req, res, next) => {
                const response = this.authenticationRepo.verifyBearerToken(req.headers["authorization"], auth_1.TokenType.emailVerification);
                if (response.status === false) {
                    return res.status(403).json({
                        status: response.status,
                        noPublicKey: true,
                        error: response.error,
                    });
                }
                req.key = response.data;
                return next();
            };
        };
        this.getSingleFileFromFiles = (files) => {
            let file = '';
            if (files) {
                file = files.map((f) => f.location)[0];
            }
            return file;
        };
        this.getMultipleFilesFromFiles = (files) => {
            let newFiles = [];
            if (files) {
                newFiles = files.map((f) => f.location);
            }
            return newFiles;
        };
        this.post = (path, callback) => {
            this._recordEndpoint(path, 'POST', '');
            this._post(path, (req, res) => {
                try {
                    const { params } = req;
                    const _send = (code, data) => {
                        return res.status(code).json(data);
                    };
                    return callback({ params }, _send);
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                        error: ERROR_OCCURED
                    });
                }
            });
        };
        this.get = (path, callback) => {
            this._recordEndpoint(path, 'GET', '');
            this._get(path, (req, res) => {
                try {
                    const { params, query } = req;
                    const _send = (code, data) => {
                        return res.status(code).json(data);
                    };
                    return callback({ params, query }, _send);
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                        error: ERROR_OCCURED
                    });
                }
            });
        };
        this.postWithBody = (path, callback) => {
            this._recordEndpoint(path, 'POST', '');
            this._post(path, (req, res) => {
                try {
                    const { params, body } = req;
                    const _send = (code, data) => {
                        res.status(code).json(data);
                    };
                    return callback({ params, body }, _send);
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                        error: ERROR_OCCURED
                    });
                }
            });
        };
        this.postWithBodyAndKey = (path, callback) => {
            this._recordEndpoint(path, 'POST', '[ key ]');
            this._post(path, this.verifyKey(), (req, res) => {
                try {
                    const { params, body, key } = req;
                    const _send = (code, data) => {
                        res.status(code).json(data);
                    };
                    return callback({ params, body, key }, _send);
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                        error: ERROR_OCCURED
                    });
                }
            });
        };
        this.getWithAuth = (path, callback) => {
            this._recordEndpoint(path, 'GET', '[ auth ]');
            this._get(path, this._authenticate(), (req, res) => {
                try {
                    const { params, user, query } = req;
                    const _send = (code, data) => {
                        res.status(code).json(data);
                    };
                    return callback({ params, query, user }, _send);
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                        error: ERROR_OCCURED
                    });
                }
            });
        };
        this.postWithBodyAndAuth = (path, callback) => {
            this._recordEndpoint(path, 'POST', '[ auth ]');
            this._post(path, this._authenticate(), (req, res) => {
                try {
                    const { query, params, body, user } = req;
                    const _send = (code, data) => {
                        res.status(code).json(data);
                    };
                    return callback({ query, params, body, user }, _send);
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                        error: ERROR_OCCURED
                    });
                }
            });
        };
        this.putWithBodyAndAuth = (path, callback) => {
            this._recordEndpoint(path, 'PUT', '[ auth ]');
            this._put(path, this._authenticate(), (req, res) => {
                try {
                    const { query, params, body, user } = req;
                    const _send = (code, data) => {
                        res.status(code).json(data);
                    };
                    return callback({ query, params, body, user }, _send);
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                        error: ERROR_OCCURED
                    });
                }
            });
        };
        this.deleteWithAuth = (path, callback) => {
            this._recordEndpoint(path, 'DELETE', '[ auth file ]');
            this._delete(path, this._authenticate(), (req, res) => {
                const { params, user } = req;
                const body = Object.assign({}, req.body);
                const _send = (code, data) => {
                    res.status(code).json(data);
                };
                return callback({ params, body, user }, _send);
            });
        };
        this.extend = (path, callback, options) => {
            var _a;
            let trimmedPath = path.trim()[0] === '/' ? path.trim().substring(1) : path.trim();
            const router = new RequestHandler({
                router: this.router,
                authenticationRepo: this.authenticationRepo,
                host: `${this.host}/${trimmedPath}`,
                tokenType: (_a = options === null || options === void 0 ? void 0 : options.tokenType) !== null && _a !== void 0 ? _a : this.tokenType
            });
            callback({ router });
            setTimeout(() => {
                this.endPointList.push(...router.endPointList);
            }, 1000);
        };
        this.authenticationRepo = authenticationRepo;
        this.router = router;
        this.host = host;
        this.tokenType = tokenType !== null && tokenType !== void 0 ? tokenType : auth_1.TokenType.accessToken;
    }
    get listEndPoint() {
        return this.endPointList;
    }
}
exports.default = RequestHandler;
