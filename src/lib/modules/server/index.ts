//@ts-check

import express, { Express } from 'express';
import LoggerInterface from "../../../types/interfaces/logger";

import cors from 'cors';
import Server from './server';
import ConfigInterface from '../../../types/interfaces/config';
import { defaultLogger } from '../logger';

const server = (callback: (app: Express, server: any) => void) => {
    const app = express();
    app.use(cors());

    app.use(express.static('public'));

    app.use(express.urlencoded({
        extended: true
    }));

    app.use(express.json());

    const server = new Server({app});
    server.development();

    callback(app, server);

    return {app, server};
}

export default server;