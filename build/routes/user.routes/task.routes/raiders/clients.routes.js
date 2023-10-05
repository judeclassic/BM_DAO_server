"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raider_client_controller_1 = __importDefault(require("../../../../domain/controllers/task.controller/raider.controller/raider.client.controller"));
const raider_client_service_1 = __importDefault(require("../../../../domain/services/task.service/raider.service/raider.client.service"));
const task_validator_1 = __importDefault(require("../../../../domain/validators/task.validator"));
const user_model_1 = __importDefault(require("../../../../lib/modules/db/models/user.model"));
const raider_model_1 = __importDefault(require("../../../../lib/modules/db/models/service/raider.model"));
const raider_model_2 = __importDefault(require("../../../../lib/modules/db/models/task/raider.model"));
const useRaiderTaskForClientRoutes = ({ router }) => {
    const taskValidator = new task_validator_1.default();
    const userModel = new user_model_1.default();
    const raiderTaskModel = new raider_model_2.default();
    const raiderServiceModel = new raider_model_1.default();
    const raiderTaskService = new raider_client_service_1.default({ raiderTaskModel, userModel, raiderServiceModel });
    const clientRaidController = new raider_client_controller_1.default({ taskValidator, raiderTaskService });
    router.postWithBodyAndAuth('/create_raid', clientRaidController.createRaidTask);
    router.postWithBodyAndAuth('/create_task', clientRaidController.createTask);
    router.getWithAuth('/getuserraids', clientRaidController.getAllUserTask);
    router.getWithAuth('/getsingleraid', clientRaidController.getUserSingleTask);
};
exports.default = useRaiderTaskForClientRoutes;
