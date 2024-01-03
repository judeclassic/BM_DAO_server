"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../../lib/modules/auth"));
const moderator_model_1 = __importDefault(require("../../../lib/modules/db/models/service/moderator.model"));
const raider_model_1 = __importDefault(require("../../../lib/modules/db/models/service/raider.model"));
const user_model_1 = __importDefault(require("../../../lib/modules/db/models/user.model"));
const mailer_1 = __importDefault(require("../../../lib/modules/mailer"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_service_1 = __importDefault(require("./auth.service"));
const auth_validator_1 = __importDefault(require("./auth.validator"));
const useUserAuthRoutes = ({ router }) => {
    const authValidator = new auth_validator_1.default();
    const authRepo = new auth_1.default();
    const mailRepo = new mailer_1.default();
    const userModel = new user_model_1.default();
    const moderatorUserServiceModel = new moderator_model_1.default();
    const raiderUserServiceModel = new raider_model_1.default();
    const userAuthService = new auth_service_1.default({ mailRepo, authRepo, userModel, raiderUserServiceModel, moderatorUserServiceModel });
    // AUTH ROUTES HANDLER
    const userAuthController = new auth_controller_1.default({ authValidator, userAuthService });
    router.postWithBody('/register', userAuthController.registerUser);
    router.postWithBody('/login', userAuthController.loginUser);
    router.postWithBody('/password/reset', userAuthController.resetPassword);
    router.postWithBody('/password/confirmreset', userAuthController.confirmResetPassword);
    router.postWithBodyAndAuth('/logout', userAuthController.logout);
};
exports.default = useUserAuthRoutes;
