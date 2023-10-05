"use strict";
//@ts-check
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const server_1 = __importDefault(require("./server"));
const server = (callback) => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.static('public'));
    app.use(express_1.default.urlencoded({
        extended: true
    }));
    app.use(express_1.default.json());
    const server = new server_1.default({ app });
    server.development();
    callback(app, server);
    return { app, server };
};
exports.default = server;
