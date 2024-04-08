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
    constructor({ userModel, transactionModel, cryptoRepository }) {
        this.getWalletInformation = (userId) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (!user.data.wallet.wallet) {
                const wallet = this._cryptoRepository.createWallet();
                if (!(wallet === null || wallet === void 0 ? void 0 : wallet.address)) {
                    return { errors: [ERROR_USER_NOT_FOUND] };
                }
                user.data.wallet.wallet = {
                    address: wallet.address,
                    privateKey: wallet.private_key
                };
            }
            const finalUser = yield this._userModel.updateUserDetailToDB(user.data.id, {
                wallet: user.data.wallet
            });
            if (!finalUser.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const walletBalance = this._cryptoRepository.getTokenPrice((_a = user.data.wallet.wallet) === null || _a === void 0 ? void 0 : _a.address);
            if (!walletBalance) {
                user.data.wallet.wallet.balance = walletBalance;
            }
            return { user: finalUser.data };
        });
        this.fundUserWallet = (userId, amount) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (!user.data.wallet.wallet)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const cryptoDeposit = yield this._cryptoRepository.deposit({ address: (_b = user.data.wallet.wallet) === null || _b === void 0 ? void 0 : _b.address, private_key: (_c = user.data.wallet.wallet) === null || _c === void 0 ? void 0 : _c.privateKey, amount: amount });
            if (cryptoDeposit.error) {
                return { errors: [{ message: cryptoDeposit.error }] };
            }
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
            var _d;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (!user.data.wallet.wallet)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const cryptoWithdrawal = yield this._cryptoRepository.withdrawal({ address: (_d = user.data.wallet.wallet) === null || _d === void 0 ? void 0 : _d.address, amount: amount });
            if (cryptoWithdrawal.error) {
                return { errors: [{ message: cryptoWithdrawal.error }] };
            }
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
        this._cryptoRepository = cryptoRepository;
    }
}
exports.default = UserWalletService;
