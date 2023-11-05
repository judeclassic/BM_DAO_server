"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../../../../lib/modules/auth"));
const raider_model_1 = __importDefault(require("../../../../../lib/modules/db/models/service/raider.model"));
const transaction_model_1 = __importDefault(require("../../../../../lib/modules/db/models/transaction.model"));
const user_model_1 = __importDefault(require("../../../../../lib/modules/db/models/user.model"));
const raider_service_controller_1 = __importDefault(require("./raider_service.controller"));
const raider_service_service_1 = __importDefault(require("./raider_service.service"));
const raider_service_validator_1 = __importDefault(require("./raider_service.validator"));
const useRaiderUserServicesRoutes = ({ router }) => {
    const raiderServiceValidator = new raider_service_validator_1.default();
    const authRepo = new auth_1.default();
    const userModel = new user_model_1.default();
    const userServiceModel = new raider_model_1.default();
    const transactionModel = new transaction_model_1.default();
    const raiderServiceService = new raider_service_service_1.default({ authRepo, userModel, userServiceModel, transactionModel });
    const userServiceController = new raider_service_controller_1.default({ raiderServiceValidator, raiderServiceService });
    router.postWithBodyAndAuth('/subscribe', userServiceController.subscribeUserService);
    router.postWithBodyAndAuth('/resubscribe', userServiceController.reSubscribeUserService);
    router.getWithAuth('/all', userServiceController.listAllUserServices);
    router.getWithAuth('/', userServiceController.getUserService);
    router.postWithBodyAndAuth('/unsubscibe', userServiceController.unSubscribeFromUserService);
};
exports.default = useRaiderUserServicesRoutes;
