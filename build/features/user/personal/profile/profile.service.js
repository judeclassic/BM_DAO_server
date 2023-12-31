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
const errors_1 = require("../../../../types/constants/errors");
const ERROR_USER_NOT_FOUND = {
    field: 'password',
    message: 'User with this email/password combination does not exist.',
};
class UserProfileService {
    constructor({ userModel, raiderUserServiceModel, moderatorUserServiceModel }) {
        this.updateProfileInformation = (userId, { name, phoneNumber, country }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (user.error || !user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const finalUser = yield this._userModel.updateUserDetailToDB(user.data.id, {
                name: name !== null && name !== void 0 ? name : user.data.name,
                phoneNumber: phoneNumber !== null && phoneNumber !== void 0 ? phoneNumber : user.data.phoneNumber,
                country: country !== null && country !== void 0 ? country : user.data.country,
                updatedAt: new Date()
            });
            if (finalUser.error || !finalUser.data)
                return { errors: [errors_1.ERROR_INSUFFICIENT_PERMISSIONS] };
            const raiderService = yield this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
            finalUser.data.raiderService = raiderService.data;
            const moderatorService = yield this._moderatorUserServiceModel.checkIfExist({ userId: user.data.id });
            user.data.moderatorService = moderatorService.data;
            return { user: finalUser.data };
        });
        this.findUserById = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (user.error || !user.data)
                return null;
            const raiderService = yield this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
            user.data.raiderService = raiderService.data;
            const moderatorService = yield this._moderatorUserServiceModel.checkIfExist({ userId: user.data.id });
            user.data.moderatorService = moderatorService.data;
            return user.data;
        });
        this.getUserReferals = (userId, level) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (user.error || !user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const raiderService = yield this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
            user.data.raiderService = raiderService.data;
            const referals = yield this.getReferalInfo(level, user.data.referal);
            console.log(user.data.referal);
            user.data.referals = referals === null || referals === void 0 ? void 0 : referals.data;
            return { data: user.data };
        });
        this.getReferalInfo = (level, referal) => __awaiter(this, void 0, void 0, function* () {
            if (level === '1') {
                const userWith1stReferalExists = yield this._userModel.getReferals({ referalCode1: referal === null || referal === void 0 ? void 0 : referal.myReferalCode });
                return userWith1stReferalExists;
            }
            if (level === '2') {
                const userWith1stReferalExists = yield this._userModel.getReferals({ referalCode2: referal === null || referal === void 0 ? void 0 : referal.myReferalCode });
                return userWith1stReferalExists;
            }
            if (level === '3') {
                const userWith1stReferalExists = yield this._userModel.getReferals({ referalCode3: referal === null || referal === void 0 ? void 0 : referal.myReferalCode });
                return userWith1stReferalExists;
            }
        });
        this._userModel = userModel;
        this._raiderUserServiceModel = raiderUserServiceModel;
        this._moderatorUserServiceModel = moderatorUserServiceModel;
    }
}
exports.default = UserProfileService;
