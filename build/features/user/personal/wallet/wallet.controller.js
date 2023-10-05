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
class UserWalletController {
    constructor({ userService, userValidator }) {
        this.fundUserWallet = ({ user, body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            if (!body.amount)
                return sendJson(403, { code: 403, status: false, error: [{ message: 'please enter amount' }] });
            const transaction = yield this._userService.fundUserWallet(user.id, body.amount);
            if (!transaction.data)
                return sendJson(401, { error: transaction.errors, status: false, code: 401 });
            return sendJson(200, { status: true, code: 200, data: transaction.data.getResponse });
        });
        this.withdrawUserWallet = ({ user, body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            if (!body.amount)
                return sendJson(403, { code: 403, status: false, error: [{ message: 'please enter amount' }] });
            const transaction = yield this._userService.withdrawUserWallet(user.id, body.amount);
            if (!transaction.data)
                return sendJson(401, { error: transaction.errors, status: false, code: 401 });
            return sendJson(200, { status: true, code: 200, data: transaction.data.getResponse });
        });
        this.getAllUserTransaction = ({ user, query }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            if (!user.id)
                return sendJson(403, { code: 403, status: false });
            const foundUser = yield this._userService.getAllUserTransaction(user.id, query);
            if (!foundUser.data)
                return sendJson(401, { error: [{ message: 'User is not found' }], status: false, code: 401 });
            return sendJson(200, { status: true, code: 200, data: foundUser.data.getResponse });
        });
        this._userService = userService;
        this._userValidator = userValidator;
    }
}
exports.default = UserWalletController;
