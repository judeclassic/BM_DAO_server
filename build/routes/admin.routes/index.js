"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_controller_1 = __importDefault(require("../../domain/controllers/admin.controller/admin.controller"));
const admin_service_1 = __importDefault(require("../../domain/services/admin.service/admin.service"));
const admin_validator_1 = __importDefault(require("../../domain/validators/admin.validator"));
const auth_1 = __importDefault(require("../../lib/modules/auth"));
const admin_model_1 = __importDefault(require("../../lib/modules/db/models/admin.model"));
const useAdminRoutes = ({ router }) => {
    const adminValidator = new admin_validator_1.default();
    const authRepo = new auth_1.default();
    const adminModel = new admin_model_1.default();
    const adminService = new admin_service_1.default({ authRepo, adminModel });
    const authController = new admin_controller_1.default({ adminValidator, adminService });
    router.postWithBody('/login', authController.loginAdmin);
    router.getWithAuth('/', authController.viewProfile);
};
exports.default = useAdminRoutes;
