"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_response_1 = require("../../../../types/interfaces/response/transaction.response");
const ERROR_USER_NOT_FOUND = {
    field: 'password',
    message: 'User with this email/password combination does not exist.',
};
class UserWalletService {
    constructor({ userModel, transactionModel }) {
        this.fundUserWallet = (userId, amount) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            user.data.updateUserWithdrawableBalance({ amount, type: 'paid' });
            const updatedUser = yield this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
            if (!updatedUser.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const transaction = yield this._transactionModel.saveTransaction({
                name: updatedUser.data.name,
                userId: user.data.id,
                updatedAt: new Date(),
                createdAt: new Date(),
                transactionType: transaction_response_1.TransactionTypeEnum.FUNDING,
                transactionStatus: transaction_response_1.TransactionStatusEnum.PENDING,
                amount: amount,
                isVerified: true,
            });
            if (!transaction.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            return { data: transaction.data };
        });
        this.withdrawUserWallet = (userId, amount) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            user.data.updateUserWithdrawableBalance({ amount, type: 'charged' });
            const updatedUser = yield this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
            if (!updatedUser.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const transaction = yield this._transactionModel.saveTransaction({
                name: updatedUser.data.name,
                userId: user.data.id,
                updatedAt: new Date(),
                createdAt: new Date(),
                transactionType: transaction_response_1.TransactionTypeEnum.WITHDRAWAL,
                transactionStatus: transaction_response_1.TransactionStatusEnum.PENDING,
                amount: amount,
                isVerified: true,
            });
            if (!transaction.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            return { data: transaction.data };
        });
        this.getAllUserTransaction = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this._transactionModel.getTransactions({ userId }, option);
            if (!transactions.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            return { data: transactions.data };
        });
        this._userModel = userModel;
        this._transactionModel = transactionModel;
    }
}
exports.default = UserWalletService;
