"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const client_routes_1 = __importDefault(require("./client/client.routes"));
const personal_routes_1 = __importDefault(require("./personal/personal.routes"));
const worker_routes_1 = __importDefault(require("./worker/worker.routes"));
const useUserRoutes = ({ router }) => {
    router.extend('/auth', auth_routes_1.default);
    router.extend('/client', client_routes_1.default);
    router.extend('/personal', personal_routes_1.default);
    router.extend('/worker', worker_routes_1.default);
};
exports.default = useUserRoutes;
