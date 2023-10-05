import server from './lib/modules/server/index';
import DBConnection from './lib/modules/db';
import RouterInterface from './types/interfaces/router';
import config from './lib/constant/config';
import { defaultLogger } from './lib/modules/logger';
import loadEnv from './lib/constant/load-env';
import AuthorizationRepo from './lib/modules/auth';
import RequestHandler from './lib/modules/server/router';
import useUserRoutes from './features/user/user.routes';

loadEnv();

const dBConnection = new DBConnection(defaultLogger);

dBConnection.connect({config});

const callback = (app: RouterInterface, server: any)=> {
    const authenticationRepo = new AuthorizationRepo();
    
    const router = new RequestHandler({ router: app,  authenticationRepo, host: '/api' });
    
    router.extend('/user', useUserRoutes);

    if (process.env.NODE_ENV === 'development') defaultLogger.checkRoutes(router);
    if (process.env.NODE_ENV === 'development') defaultLogger.useExpressMonganMiddleWare(app);
}

module.exports = server(callback);