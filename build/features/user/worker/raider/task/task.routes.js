"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raider_model_1 = __importDefault(require("../../../../../lib/modules/db/models/task/raider.model"));
const task_controller_1 = __importDefault(require("./task.controller"));
const task_service_1 = __importDefault(require("./task.service"));
const task_validator_1 = __importDefault(require("./task.validator"));
const useRaiderTaskForUserRoutes = ({ router }) => {
    const taskValidator = new task_validator_1.default();
    const raiderTaskModel = new raider_model_1.default();
    const raiderTaskService = new task_service_1.default({ raiderTaskModel });
    const clientRaidController = new task_controller_1.default({ taskValidator, raiderTaskService });
    router.getWithAuth('/active', clientRaidController.getAllActiveTask);
    router.getWithAuth('/other', clientRaidController.getAllOtherTask);
    router.getWithAuth('/single_task/:taskId', clientRaidController.getSingleTask);
};
exports.default = useRaiderTaskForUserRoutes;
