"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../../domain/services/user.service/user.service"));
const auth_1 = __importDefault(require("../../lib/modules/auth"));
const mailer_1 = __importDefault(require("../../lib/modules/mailer"));
const user_model_1 = __importDefault(require("../../lib/modules/db/models/user.model"));
const user_controller_1 = __importDefault(require("../../domain/controllers/user.controller/user.controller"));
const user_validator_1 = __importDefault(require("../../domain/validators/user.validator"));
const useUserProfileRoutes = ({ router }) => {
    const userValidator = new user_validator_1.default();
    const authRepo = new auth_1.default();
    const mailRepo = new mailer_1.default();
    const userModel = new user_model_1.default();
    const userService = new user_service_1.default({ mailRepo, authRepo, userModel });
    const userController = new user_controller_1.default({ userValidator, userService });
    router.getWithAuth('/', userController.viewProfile);
    router.postWithBodyAndAuth('/update', userController.updateProfile);
};
exports.default = useUserProfileRoutes;
