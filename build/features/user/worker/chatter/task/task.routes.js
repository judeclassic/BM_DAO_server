"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = __importDefault(require("../../../../../lib/modules/db/models/task/chat.model"));
const chatter_model_1 = __importDefault(require("../../../../../lib/modules/db/models/task/chatter.model"));
const task_controller_1 = __importDefault(require("./task.controller"));
const task_service_1 = __importDefault(require("./task.service"));
const task_validator_1 = __importDefault(require("./task.validator"));
const useChatterTaskForUserRoutes = ({ router }) => {
    const taskValidator = new task_validator_1.default();
    const chatTaskModel = new chat_model_1.default();
    const chatterTaskModel = new chatter_model_1.default();
    const chatterTaskService = new task_service_1.default({ chatTaskModel, chatterTaskModel });
    const chatterTaskController = new task_controller_1.default({ taskValidator, chatterTaskService });
    router.getWithAuth('/active', chatterTaskController.getAllActiveTask);
    router.getWithAuth('/other', chatterTaskController.getAllOtherTask);
    router.getWithAuth('/other/time', chatterTaskController.getAllOtherCliamableTask);
    router.getWithAuth('/single_task/:taskId', chatterTaskController.getSingleTask);
};
exports.default = useChatterTaskForUserRoutes;
