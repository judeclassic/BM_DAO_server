"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../../../../../lib/modules/db/models/transaction.model"));
const user_model_1 = __importDefault(require("../../../../../lib/modules/db/models/user.model"));
const chatter_controller_1 = __importDefault(require("./chatter.controller"));
const chatter_validator_1 = __importDefault(require("./chatter.validator"));
const chat_model_1 = __importDefault(require("../../../../../lib/modules/db/models/task/chat.model"));
const chatter_model_1 = __importDefault(require("../../../../../lib/modules/db/models/task/chatter.model"));
const chatter_model_2 = __importDefault(require("../../../../../lib/modules/db/models/service/chatter.model"));
const chatter_service_1 = __importDefault(require("./chatter.service"));
const useClientChattersTaskRoutes = ({ router }) => {
    const taskValidator = new chatter_validator_1.default();
    const userModel = new user_model_1.default();
    const chatTaskModel = new chat_model_1.default();
    const chatterTaskModel = new chatter_model_1.default();
    const chatterServiceModel = new chatter_model_2.default();
    const transactionModel = new transaction_model_1.default();
    const raiderTaskService = new chatter_service_1.default({ chatterTaskModel, chatTaskModel, userModel, chatterServiceModel, transactionModel });
    const clientRaidController = new chatter_controller_1.default({ taskValidator, raiderTaskService });
    router.postWithBodyAndAuth('/create_task', clientRaidController.createTask);
    router.getWithAuth('/getactiveusertasks', clientRaidController.getActiveTasks);
    router.getWithAuth('/getusertasks', clientRaidController.getAllUserTask);
    router.getWithAuth('/getsingleTask', clientRaidController.getUserSingleTask);
};
exports.default = useClientChattersTaskRoutes;
