"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../../../../lib/modules/auth"));
const chatter_model_1 = __importDefault(require("../../../../../lib/modules/db/models/service/chatter.model"));
const transaction_model_1 = __importDefault(require("../../../../../lib/modules/db/models/transaction.model"));
const user_model_1 = __importDefault(require("../../../../../lib/modules/db/models/user.model"));
const chatter_service_controller_1 = __importDefault(require("./chatter_service.controller"));
const chatter_service_service_1 = __importDefault(require("./chatter_service.service"));
const chatter_service_validator_1 = __importDefault(require("./chatter_service.validator"));
const useChatterUserServicesRoutes = ({ router }) => {
    const raiderServiceValidator = new chatter_service_validator_1.default();
    const authRepo = new auth_1.default();
    const userModel = new user_model_1.default();
    const userServiceModel = new chatter_model_1.default();
    const transactionModel = new transaction_model_1.default();
    const raiderServiceService = new chatter_service_service_1.default({ authRepo, userModel, userServiceModel, transactionModel });
    const userServiceController = new chatter_service_controller_1.default({ raiderServiceValidator, raiderServiceService });
    router.postWithBodyAndAuth('/subscribe', userServiceController.subscribeUserService);
    router.postWithBodyAndAuth('/resubscribe', userServiceController.reSubscribeUserService);
    router.getWithAuth('/all', userServiceController.listAllUserServices);
    router.getWithAuth('/', userServiceController.getUserService);
    router.postWithBodyAndAuth('/unsubscibe', userServiceController.unSubscribeFromUserService);
    router.postWithBodyAndAuth('/updatehandle', userServiceController.updateSocialHandle);
};
exports.default = useChatterUserServicesRoutes;
