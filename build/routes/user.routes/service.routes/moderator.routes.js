"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../../lib/modules/auth"));
const user_model_1 = __importDefault(require("../../../lib/modules/db/models/user.model"));
const user_service_validator_1 = __importDefault(require("../../../domain/validators/user_service.validator"));
const raider_model_1 = __importDefault(require("../../../lib/modules/db/models/service/raider.model"));
const moderators_controller_1 = __importDefault(require("../../../domain/controllers/service.controller/moderators.controller"));
const moderator_service_1 = __importDefault(require("../../../domain/services/user.service/services/moderator.service"));
const useModeratorUserServicesRoutes = ({ router }) => {
    const userServiceValidator = new user_service_validator_1.default();
    const authRepo = new auth_1.default();
    const userModel = new user_model_1.default();
    const userServiceModel = new raider_model_1.default();
    const userServiceService = new moderator_service_1.default({ authRepo, userModel, userServiceModel });
    const userServiceController = new moderators_controller_1.default({ userServiceValidator, userServiceService });
    router.postWithBodyAndAuth('/subscribe', userServiceController.subscribeUserService);
    router.postWithBodyAndAuth('/resubscribe', userServiceController.reSubscribeUserService);
    router.getWithAuth('/', userServiceController.listAllUserServices);
    router.postWithBodyAndAuth('/unsubscibe', userServiceController.unSubscribeFromUserService);
};
exports.default = useModeratorUserServicesRoutes;
