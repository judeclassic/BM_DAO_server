"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moderator_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/service/moderator.model"));
const raider_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/service/raider.model"));
const raid_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/task/raid.model"));
const raider_model_2 = __importDefault(require("../../../../../../lib/modules/db/models/task/raider.model"));
const transaction_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/transaction.model"));
const user_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/user.model"));
const moderator_controller_1 = __importDefault(require("./moderator.controller"));
const moderator_service_1 = __importDefault(require("./moderator.service"));
const moderator_validator_1 = __importDefault(require("./moderator.validator"));
const useRaiderTaskForModeratorRoutes = ({ router }) => {
    const taskValidator = new moderator_validator_1.default();
    const userModel = new user_model_1.default();
    const raidModel = new raid_model_1.default();
    const raiderTaskModel = new raider_model_2.default();
    const raiderServiceModel = new raider_model_1.default();
    const moderatorServiceModel = new moderator_model_1.default();
    const transactionModel = new transaction_model_1.default();
    const moderatorUserTaskService = new moderator_service_1.default({ raiderTaskModel, raidModel, raiderServiceModel, moderatorServiceModel, userModel, transactionModel });
    const clientRaidController = new moderator_controller_1.default({ taskValidator, moderatorUserTaskService });
    router.getWithAuth('/active', clientRaidController.getAllActiveTask);
    router.getWithAuth('/other', clientRaidController.getAllOtherTask);
    router.postWithBodyAndAuth('/moderate_task', clientRaidController.moderateTask);
    router.getWithAuth('/me/active', clientRaidController.getAllModeratorsActiveTasks);
    router.getWithAuth('/me/other', clientRaidController.getAllModeratorsTasks);
    router.getWithAuth('/me', clientRaidController.getModeratorTask);
    router.postWithBodyAndAuth('/me/approve', clientRaidController.approveTaskAsComplete);
    router.getWithAuth('/raids/:taskId', clientRaidController.getModeratedRaids);
    router.getWithAuth('/raid/:raidId', clientRaidController.getUserSingleRaid);
    router.postWithBodyAndAuth('/raid/approve', clientRaidController.approveRaid);
    router.postWithBodyAndAuth('/raid/reject', clientRaidController.rejectRaid);
};
exports.default = useRaiderTaskForModeratorRoutes;
