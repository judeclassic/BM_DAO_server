"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatter_service_routes_1 = __importDefault(require("./service/chatter_service.routes"));
const task_routes_1 = __importDefault(require("./task/task.routes"));
const work_routes_1 = __importDefault(require("./work/work.routes"));
const useUserChatterRoutes = ({ router }) => {
    router.extend('/service', chatter_service_routes_1.default);
    router.extend('/task', task_routes_1.default);
    router.extend('/work', work_routes_1.default);
};
exports.default = useUserChatterRoutes;
