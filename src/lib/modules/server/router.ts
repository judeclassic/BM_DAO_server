import AuthRepo from '../auth';
import { Express } from 'express';
import ErrorInterface from '../../../types/interfaces/error';
import AutheticatedUserInterface from '../../../types/interfaces/requests/user/authencated-user';
import { TokenType } from '../../../types/interfaces/modules/auth';

const ERROR_OCCURED: ErrorInterface = {
    message: 'Error occured please check your request and try again',
  };

class RequestHandler {
    private router: Express
    private host: string
    private authenticationRepo: AuthRepo;
    private endPointList: { endpoint: string, method: string, middleWares: string }[] = []
    private tokenType: TokenType

    constructor({router, authenticationRepo, host, tokenType} : { router: any, authenticationRepo: AuthRepo, host: string, tokenType?: TokenType}) {
        this.authenticationRepo = authenticationRepo;
        this.router = router;
        this.host = host;
        this.tokenType = tokenType ?? TokenType.accessToken
    }

    get listEndPoint() {
        return this.endPointList;
    }

    private _recordEndpoint = (path: string, method: string, middleWare: string) => {
        this.endPointList.push({
            endpoint: `${this.host}${path}`,
            method: method,
            middleWares: middleWare
        });
    }

    private _post = (path: string, ...args: any[]) => {
        const host = `${this.host}${path}`;
        return this.router.post(host, ...args);
    }

    private _get = (path: string, ...args: any[]) => {
        const host = `${this.host}${path}`;
        return this.router.get(host, ...args);
    }

    private _put = (path: string, ...args: any[]) => {
        const host = `${this.host}${path}`;
        return this.router.put(host, ...args);
    }

    private _delete = (path: string, ...args: any[]) => {
        const host = `${this.host}${path}`;
        return this.router.delete(host, ...args);
    }

    private _authenticate = () => {
        return (req: { headers: { [x: string]: any; }; user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: any; code: number, noToken: boolean; error: any; }): any; new(): any; }; }; }, next: () => any) => {
            try {
                const response = this.authenticationRepo.verifyBearerToken(req.headers["authorization"], this.tokenType);
                if ( response.status === false ) {
                    return res.status(403).json({
                        status: response.status,
                        code: 403,
                        noToken: true,
                        error: response.error,
                    });
                }
                req.user = response.data;
                return next();
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    noToken: true,
                    error: error
                })
            }
        }
    }

    public verifyKey = () => {
        return (req: { headers: { [x: string]: any; }; key: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: any; noPublicKey: boolean; error: any; }): any; new(): any; }; }; }, next: () => any) => {
            const response = this.authenticationRepo.verifyBearerToken(req.headers["authorization"], TokenType.emailVerification);
            if ( response.status === false ) {
                return res.status(403).json({
                    status: response.status,
                    noPublicKey: true,
                    error: response.error,
                });
            }
            req.key = response.data;
            return next();
        }
    }

    private getSingleFileFromFiles = (files: any) => {
        let file = '';
        
        if (files) {
            file = files.map((f: { location: any; }) => f.location)[0];
        }
        return file;
    }

    private getMultipleFilesFromFiles = (files: any) => {
        let newFiles: any[] = [];

        if (files) {
            newFiles = files.map((f: { location: any; }) => f.location);
        }
        return newFiles;
    }

    public post = (path: any, callback: (arg0: { params: any; }, arg1: (code: any, data: any) => any) => any) => {
        this._recordEndpoint(path, 'POST', '')
        this._post(path, (req: { params: any; }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): any; new(): any; }; }; }) => {
            try {
                const { params } = req;
                const _send = (code: number, data: any)=> {
                    return res.status(code).json(data);
                }

                return callback({ params }, _send );
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error,
                    error: ERROR_OCCURED
                })
            }
        })
    }

    public get = (path: any, callback: (arg0: { params: any; query: any }, arg1: (code: any, data: any) => any) => any) => {
        this._recordEndpoint(path, 'GET', '')
        this._get(path, (req: { params: any; query: any }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): any; new(): any; }; }; }) => {
            try {
                const { params, query } = req;
                const _send = (code: number, data: any)=> {
                    return res.status(code).json(data);
                }

                return callback({ params, query }, _send );
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error,
                    error: ERROR_OCCURED
                })
            }
        })
    }

    public postWithBody = (path: string, callback: (arg0: { params: any; body: any; }, arg1: (code: any, data: any) => void) => any) => {
        this._recordEndpoint(path, 'POST', '');
        this._post(path, (req: { params: any; body: any; }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
            try {
                const { params, body } = req;
                const _send = (code: number, data: { code: number; message: string; error: string[]; data: any; })=> {
                    res.status(code).json(data);
                }

                return callback({ params, body }, _send );
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error,
                    error: ERROR_OCCURED
                });
            }
        })
    }

    postWithBodyAndKey = (path: string, callback: (arg0: { params: any; body: any; key: any; }, arg1: (code: any, data: any) => void) => any) => {
        this._recordEndpoint(path, 'POST', '[ key ]')
        this._post(path, this.verifyKey(), (req: { params: any; body: any; key: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
            try {
                const { params, body, key } = req;
                const _send = (code: number, data: any)=> {
                    res.status(code).json(data);
                }

                return callback({ params, body, key }, _send );
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error,
                    error: ERROR_OCCURED
                })
            }
        });
    }

    getWithAuth = (path: string, callback: (arg0: { params: any; query: any; user: AutheticatedUserInterface; }, arg1: (code: any, data: any) => void) => any) => {
        this._recordEndpoint(path, 'GET', '[ auth ]')
        this._get(path, this._authenticate(), (req: { params: any; user: any; query: any }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
            try {
                const { params, user, query } = req;
                const _send = (code: any, data: any)=> {
                    res.status(code).json(data);
                }

                return callback({ params, query, user }, _send);
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error,
                    error: ERROR_OCCURED
                })
            }
        })
    }
    
     postWithBodyAndAuth = (path: string, callback: (arg0: { query: any, params: any; body: any; user: AutheticatedUserInterface; }, arg1: (code: any, data: any) => void) => any) => {
        this._recordEndpoint(path, 'POST', '[ auth ]')
        this._post(path, this._authenticate(), (req: { query: any, params: any; body: any; user: any; }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
            try {
                const { query, params, body, user } = req;
    
                const _send = (code: any, data: any)=> {
                    res.status(code).json(data);
                }

                return callback({ query, params, body, user }, _send);
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error,
                    error: ERROR_OCCURED
                })
            }
        })
    }

     putWithBodyAndAuth = (path: string, callback: (arg0: { query: any, params: any; body: any; user: AutheticatedUserInterface; }, arg1: (code: any, data: any) => void) => any) => {
        this._recordEndpoint(path, 'PUT', '[ auth ]')
        this._put(path, this._authenticate(), (req: { query: any, params: any; body: any; user: any; }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
            try {
                const { query, params, body, user } = req;
    
                const _send = (code: any, data: any)=> {
                    res.status(code).json(data);
                }

                return callback({ query, params, body, user }, _send);
            } catch (error) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error,
                    error: ERROR_OCCURED
                })
            }
        })
    }

    deleteWithAuth = (path: string, callback: (arg0: { params: any; body: any; user: AutheticatedUserInterface; }, arg1: (code: any, data: any) => void ) => any) => {
        this._recordEndpoint(path, 'DELETE', '[ auth file ]')
        this._delete(path, this._authenticate(), (req: { params: any; body: any; user: any; }, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
            const { params, user } = req;
            const body = Object.assign({},req.body);
        
            const _send = (code: any, data: any)=> {
                res.status(code).json(data);
            }

            return callback({ params, body, user }, _send );
        });
    }

    extend = (path: string, callback: ({router}: {router: RequestHandler}) => void, options?: {tokenType?: TokenType}) => {
        let trimmedPath = path.trim()[0] === '/' ? path.trim().substring(1) : path.trim();
        const router = new RequestHandler({
            router: this.router,
            authenticationRepo: this.authenticationRepo,
            host: `${this.host}/${trimmedPath}`,
            tokenType: options?.tokenType ?? this.tokenType
        });

        callback({router});

        setTimeout(()=> {
            this.endPointList.push(...router.endPointList);
        },1000);
    }
}

export default RequestHandler;