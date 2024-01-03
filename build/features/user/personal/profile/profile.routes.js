"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moderator_model_1 = __importDefault(require("../../../../lib/modules/db/models/service/moderator.model"));
const raider_model_1 = __importDefault(require("../../../../lib/modules/db/models/service/raider.model"));
const user_model_1 = __importDefault(require("../../../../lib/modules/db/models/user.model"));
const profile_controller_1 = __importDefault(require("./profile.controller"));
const profile_service_1 = __importDefault(require("./profile.service"));
const profile_validator_1 = __importDefault(require("./profile.validator"));
const useUserProfileRoutes = ({ router }) => {
    const userValidator = new profile_validator_1.default();
    const userModel = new user_model_1.default();
    const raiderUserServiceModel = new raider_model_1.default();
    const moderatorUserServiceModel = new moderator_model_1.default();
    const userService = new profile_service_1.default({ userModel, raiderUserServiceModel, moderatorUserServiceModel });
    const userController = new profile_controller_1.default({ userValidator, userService });
    router.getWithAuth('/', userController.viewProfile);
    router.postWithBodyAndAuth('/update', userController.updateProfile);
    router.getWithAuth('/referal/:level', userController.getUserReferals);
};
exports.default = useUserProfileRoutes;
