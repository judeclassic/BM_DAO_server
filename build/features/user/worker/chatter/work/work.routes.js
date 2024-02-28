"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatter_model_1 = __importDefault(require("../../../../../lib/modules/db/models/service/chatter.model"));
const chat_model_1 = __importDefault(require("../../../../../lib/modules/db/models/task/chat.model"));
const chatter_model_2 = __importDefault(require("../../../../../lib/modules/db/models/task/chatter.model"));
const user_model_1 = __importDefault(require("../../../../../lib/modules/db/models/user.model"));
const work_controller_1 = __importDefault(require("./work.controller"));
const work_service_1 = __importDefault(require("./work.service"));
const work_validator_1 = __importDefault(require("./work.validator"));
const useChatterWorkForUserRoutes = ({ router }) => {
    const taskValidator = new work_validator_1.default();
    const chatModel = new chat_model_1.default();
    const chatterTaskModel = new chatter_model_2.default();
    const chatterServiceModel = new chatter_model_1.default();
    const userModel = new user_model_1.default();
    const raiderTaskService = new work_service_1.default({ chatterTaskModel, chatModel, chatterServiceModel, userModel });
    const clientRaidController = new work_controller_1.default({ taskValidator, raiderTaskService });
    router.postWithBodyAndAuth('/start_raid', clientRaidController.startRaidTask);
    router.postWithBodyAndAuth('/complete_raid', clientRaidController.completeRaidTask);
    router.postWithBodyAndAuth('/cancel_raid', clientRaidController.cancelRaidTask);
    router.getWithAuth('/', clientRaidController.getAllUserRaid);
    router.getWithAuth('/:raidId', clientRaidController.getUserSingleRaid);
};
exports.default = useChatterWorkForUserRoutes;
