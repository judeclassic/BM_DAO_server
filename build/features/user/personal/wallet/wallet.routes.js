"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../../../../lib/modules/db/models/transaction.model"));
const user_model_1 = __importDefault(require("../../../../lib/modules/db/models/user.model"));
const wallet_controller_1 = __importDefault(require("./wallet.controller"));
const wallet_service_1 = __importDefault(require("./wallet.service"));
const wallet_validator_1 = __importDefault(require("./wallet.validator"));
const useUserWalletRoutes = ({ router }) => {
    const userValidator = new wallet_validator_1.default();
    const userModel = new user_model_1.default();
    const transactionModel = new transaction_model_1.default();
    const userService = new wallet_service_1.default({ userModel, transactionModel });
    const userController = new wallet_controller_1.default({ userValidator, userService });
    router.postWithBodyAndAuth('/fund', userController.fundUserWallet);
    router.postWithBodyAndAuth('/withdraw', userController.withdrawUserWallet);
    router.getWithAuth('/all', userController.getAllUserTransaction);
};
exports.default = useUserWalletRoutes;
