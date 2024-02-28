"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatter_routes_1 = __importDefault(require("./task/chatter/chatter.routes"));
const raider_routes_1 = __importDefault(require("./task/raider/raider.routes"));
const useClientsRoutes = ({ router }) => {
    router.extend('/raider', raider_routes_1.default);
    router.extend('/chatter', chatter_routes_1.default);
};
exports.default = useClientsRoutes;
