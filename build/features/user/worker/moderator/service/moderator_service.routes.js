"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../../../../lib/modules/auth"));
const moderator_model_1 = __importDefault(require("../../../../../lib/modules/db/models/service/moderator.model"));
const user_model_1 = __importDefault(require("../../../../../lib/modules/db/models/user.model"));
const moderator_service_controller_1 = __importDefault(require("./moderator_service.controller"));
const moderator_service_service_1 = __importDefault(require("./moderator_service.service"));
const moderator_service_validator_1 = __importDefault(require("./moderator_service.validator"));
const useModeratorUserServicesRoutes = ({ router }) => {
    const userServiceValidator = new moderator_service_validator_1.default();
    const authRepo = new auth_1.default();
    const userModel = new user_model_1.default();
    const userServiceModel = new moderator_model_1.default();
    const userServiceService = new moderator_service_service_1.default({ authRepo, userModel, userServiceModel });
    const userServiceController = new moderator_service_controller_1.default({ userServiceValidator, userServiceService });
    router.postWithBodyAndAuth('/subscribe', userServiceController.subscribeUserService);
    router.postWithBodyAndAuth('/resubscribe', userServiceController.reSubscribeUserService);
    router.getWithAuth('/all', userServiceController.listAllUserServices);
    router.getWithAuth('/', userServiceController.getUserService);
    router.postWithBodyAndAuth('/unsubscibe', userServiceController.unSubscribeFromUserService);
};
exports.default = useModeratorUserServicesRoutes;
