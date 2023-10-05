"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raid_routes_1 = __importDefault(require("./raid/raid.routes"));
const raider_service_routes_1 = __importDefault(require("./service/raider_service.routes"));
const task_routes_1 = __importDefault(require("./task/task.routes"));
const useUserRaiderRoutes = ({ router }) => {
    router.extend('/task', task_routes_1.default);
    router.extend('/service', raider_service_routes_1.default);
    router.extend('/raid', raid_routes_1.default);
};
exports.default = useUserRaiderRoutes;
