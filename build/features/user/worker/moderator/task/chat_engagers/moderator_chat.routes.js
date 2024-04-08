"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moderator_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/service/moderator.model"));
const transaction_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/transaction.model"));
const user_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/user.model"));
const moderator_chat_controller_1 = __importDefault(require("./moderator_chat.controller"));
const moderator_chat_service_1 = __importDefault(require("./moderator_chat.service"));
const moderator_validator_1 = __importDefault(require("./moderator.validator"));
const chatter_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/task/chatter.model"));
const chat_model_1 = __importDefault(require("../../../../../../lib/modules/db/models/task/chat.model"));
const chatter_model_2 = __importDefault(require("../../../../../../lib/modules/db/models/service/chatter.model"));
const useRaiderTaskForModeratorRoutes = ({ router }) => {
    const taskValidator = new moderator_validator_1.default();
    const userModel = new user_model_1.default();
    const chatModel = new chat_model_1.default();
    const chatterTaskModel = new chatter_model_1.default();
    const chatterServiceModel = new chatter_model_2.default();
    const moderatorServiceModel = new moderator_model_1.default();
    const transactionModel = new transaction_model_1.default();
    const moderatorUserTaskService = new moderator_chat_service_1.default({ chatterTaskModel, chatModel, chatterServiceModel, moderatorServiceModel, userModel, transactionModel });
    const clientRaidController = new moderator_chat_controller_1.default({ taskValidator, moderatorUserTaskService });
    // router.getWithAuth('/active', clientRaidController.getAllActiveTask );
    router.getWithAuth('/other', clientRaidController.getAllOtherTask);
    router.getWithAuth('/task/:taskId', clientRaidController.getSingleTask);
    // router.postWithBodyAndAuth('/moderate_task', clientRaidController.moderateTask );
    router.getWithAuth('/me/active', clientRaidController.getAllModeratorsActiveTasks);
    router.getWithAuth('/me/other', clientRaidController.getAllModeratorsTasks);
    // router.getWithAuth('/me', clientRaidController.getModeratorTask );
    router.postWithBodyAndAuth('/me/approve', clientRaidController.approveTaskAsComplete);
    router.getWithAuth('/chats/:taskId', clientRaidController.getModeratedChats);
    router.getWithAuth('/chat/:chatId', clientRaidController.getUserSingleChat);
    router.postWithBodyAndAuth('/chat/approve', clientRaidController.approveChat);
    router.postWithBodyAndAuth('/chat/reject', clientRaidController.rejectChat);
};
exports.default = useRaiderTaskForModeratorRoutes;