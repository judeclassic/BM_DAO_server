"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clients_routes_1 = __importDefault(require("./clients.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const useRaidTaskRoutes = ({ router }) => {
    router.extend('/user', users_routes_1.default);
    router.extend('/client', clients_routes_1.default);
};
exports.default = useRaidTaskRoutes;
