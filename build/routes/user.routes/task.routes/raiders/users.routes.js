"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_validator_1 = __importDefault(require("../../../../domain/validators/task.validator"));
const user_model_1 = __importDefault(require("../../../../lib/modules/db/models/user.model"));
const raider_model_1 = __importDefault(require("../../../../lib/modules/db/models/service/raider.model"));
const raider_model_2 = __importDefault(require("../../../../lib/modules/db/models/task/raider.model"));
const raid_model_1 = __importDefault(require("../../../../lib/modules/db/models/task/raid.model"));
const raider_user_controller_1 = __importDefault(require("../../../../domain/controllers/task.controller/raider.controller/raider.user.controller"));
const raider_user_service_1 = __importDefault(require("../../../../domain/services/task.service/raider.service/raider.user.service"));
const useRaiderTaskForUserRoutes = ({ router }) => {
    const taskValidator = new task_validator_1.default();
    const userModel = new user_model_1.default();
    const raidModel = new raid_model_1.default();
    const raiderTaskModel = new raider_model_2.default();
    const raiderServiceModel = new raider_model_1.default();
    const raiderTaskService = new raider_user_service_1.default({ raiderTaskModel, raidModel, userModel, raiderServiceModel });
    const clientRaidController = new raider_user_controller_1.default({ taskValidator, raiderTaskService });
    router.getWithAuth('/active', clientRaidController.getAllActiveTask);
    router.getWithAuth('/other', clientRaidController.getAllOtherTask);
    router.postWithBodyAndAuth('/start_raid', clientRaidController.startRaidTask);
    router.postWithBodyAndAuth('/complete_task', clientRaidController.completeRaidTask);
    router.getWithAuth('/', clientRaidController.getAllUserRaid);
    router.getWithAuth('/:raidId', clientRaidController.getUserSingleRaid);
};
exports.default = useRaiderTaskForUserRoutes;
