"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raider_model_1 = __importDefault(require("../../../../../lib/modules/db/models/service/raider.model"));
const raider_model_2 = __importDefault(require("../../../../../lib/modules/db/models/task/raider.model"));
const transaction_model_1 = __importDefault(require("../../../../../lib/modules/db/models/transaction.model"));
const user_model_1 = __importDefault(require("../../../../../lib/modules/db/models/user.model"));
const raider_client_service_1 = __importDefault(require("./raider.client.service"));
const raider_controller_1 = __importDefault(require("./raider.controller"));
const raider_validator_1 = __importDefault(require("./raider.validator"));
const useClientRaidersTaskRoutes = ({ router }) => {
    const taskValidator = new raider_validator_1.default();
    const userModel = new user_model_1.default();
    const raiderTaskModel = new raider_model_2.default();
    const raiderServiceModel = new raider_model_1.default();
    const transactionModel = new transaction_model_1.default();
    const raiderTaskService = new raider_client_service_1.default({ raiderTaskModel, userModel, raiderServiceModel, transactionModel });
    const clientRaidController = new raider_controller_1.default({ taskValidator, raiderTaskService });
    router.postWithBodyAndAuth('/create_raid', clientRaidController.createRaidTask);
    router.postWithBodyAndAuth('/create_task', clientRaidController.createTask);
    router.getWithAuth('/getactiveusertasks', clientRaidController.getActiveTasks);
    router.getWithAuth('/getusertasks', clientRaidController.getAllUserTask);
    router.getWithAuth('/getsingleTask', clientRaidController.getUserSingleTask);
};
exports.default = useClientRaidersTaskRoutes;
