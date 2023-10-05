"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moderator_service_routes_1 = __importDefault(require("./service/moderator_service.routes"));
const task_routes_1 = __importDefault(require("./task/task.routes"));
const useUserWorkerModeratorRoutes = ({ router }) => {
    router.extend('/service', moderator_service_routes_1.default);
    router.extend('/task', task_routes_1.default);
};
exports.default = useUserWorkerModeratorRoutes;
