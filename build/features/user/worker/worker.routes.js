"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatter_routes_1 = __importDefault(require("./chatter/chatter.routes"));
const worker_routes_1 = __importDefault(require("./moderator/worker.routes"));
const raider_routes_1 = __importDefault(require("./raider/raider.routes"));
const useUserWorkerRoutes = ({ router }) => {
    router.extend('/chatter', chatter_routes_1.default);
    router.extend('/raider', raider_routes_1.default);
    router.extend('/moderator', worker_routes_1.default);
};
exports.default = useUserWorkerRoutes;
