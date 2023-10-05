"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("../../domain/controllers/user.controller/auth.controller"));
const auth_validator_1 = __importDefault(require("../../domain/validators/auth.validator"));
const user_service_1 = __importDefault(require("../../domain/services/user.service/user.service"));
const auth_1 = __importDefault(require("../../lib/modules/auth"));
const mailer_1 = __importDefault(require("../../lib/modules/mailer"));
const user_model_1 = __importDefault(require("../../lib/modules/db/models/user.model"));
const useUserPasswordRoutes = ({ router }) => {
    const authValidator = new auth_validator_1.default();
    const authRepo = new auth_1.default();
    const mailRepo = new mailer_1.default();
    const userModel = new user_model_1.default();
    const userService = new user_service_1.default({ mailRepo, authRepo, userModel });
    const userController = new auth_controller_1.default({ authValidator, userService });
    router.postWithBody('/reset', userController.resetPassword);
    router.postWithBody('/confirmreset', userController.confirmResetPassword);
};
exports.default = useUserPasswordRoutes;
