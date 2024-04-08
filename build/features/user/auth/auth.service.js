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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_subject_enum_1 = __importDefault(require("../../../types/enums/email-subject-enum"));
const auth_1 = require("../../../types/interfaces/modules/auth");
const ERROR_USER_ALREADY_EXISTS_WITH_EMAIL = {
    field: 'emailAddress',
    message: 'A user with this email address already exists.',
};
const ERROR_NO_USER_WITH_REFERAL_CODE = {
    field: 'referalCode',
    message: 'no user with this referal code, check and try again',
};
const ERROR_USER_NOT_FOUND = {
    field: 'password',
    message: 'User with this email/password combination does not exist.',
};
const ERROR_UNABLE_TO_SAVE_USER = {
    message: 'Unable to save user data on DB',
};
const ERROR_NO_USER_WITH_THIS_REFCODE = {
    message: 'There is no user with this referal code',
};
const ERROR_RESET_PASSWORD_TOKEN_EXPIRED = {
    message: 'This token has expired. Please request a new password reset.',
};
class UserAuthService {
    constructor({ mailRepo, authRepo, userModel, raiderUserServiceModel, moderatorUserServiceModel, cryptoRepository }) {
        this.registerUser = ({ accountType, name, username, country, emailAddress, password, referalCode }) => __awaiter(this, void 0, void 0, function* () {
            const userWithEmailExists = yield this._userModel.checkIfExist({ emailAddress });
            if (userWithEmailExists.data) {
                return { errors: [ERROR_USER_ALREADY_EXISTS_WITH_EMAIL] };
            }
            const referalCodes = yield this.getReferalInfo(referalCode);
            if (referalCodes === null || referalCodes === void 0 ? void 0 : referalCodes.errors) {
                return { errors: [ERROR_NO_USER_WITH_REFERAL_CODE] };
            }
            const myReferalCode = this._authRepo.generateCode(6);
            const hashedPassword = this._authRepo.encryptPassword(password);
            const createWallet = this._cryptoRepository.createWallet();
            if (!createWallet)
                return { errors: [ERROR_UNABLE_TO_SAVE_USER] };
            const wallet = {
                balance: { referalBonus: 0, taskBalance: 0, walletBalance: 0, totalBalance: 0 },
                wallet: {
                    address: createWallet === null || createWallet === void 0 ? void 0 : createWallet.address,
                    privateKey: createWallet === null || createWallet === void 0 ? void 0 : createWallet.private_key
                }
            };
            const request = {
                accountType,
                name,
                username,
                emailAddress,
                country,
                password: hashedPassword,
                referal: Object.assign(Object.assign({ myReferalCode }, referalCodes.referalCodes), { isGiven: false }),
                wallet
            };
            const user = yield this._userModel.saveUserToDB(request);
            if (!user.data)
                return { errors: [ERROR_UNABLE_TO_SAVE_USER] };
            const accessToken = this._authRepo.encryptToken(user.data.getUserForToken, auth_1.TokenType.accessToken);
            user.data.accessToken = accessToken;
            return { user: user.data };
        });
        this.loginUser = ({ emailAddress, password }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.checkIfExist({ emailAddress });
            if (user == null)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (user.error || !user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const passwordIsValid = this._authRepo.comparePassword(password, user.data.password);
            if (!passwordIsValid)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const accessToken = this._authRepo.encryptToken(user.data.getUserForToken, auth_1.TokenType.accessToken);
            user.data.accessToken = accessToken;
            const raiderService = yield this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
            user.data.raiderService = raiderService.data;
            const moderatorService = yield this._moderatorUserServiceModel.checkIfExist({ userId: user.data.id });
            user.data.moderatorService = moderatorService.data;
            this._userModel.updateUserDetailToDB(user.data.id, { accessToken });
            return { user: user.data };
        });
        this.logoutUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            this._userModel.updateUserDetailToDB(userId, { accessToken: undefined });
        });
        this.resetPassword = (emailAddress) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userModel.checkIfExist({ emailAddress });
            if (user == null)
                return [ERROR_USER_NOT_FOUND];
            const code = this._authRepo.generateVerificationCode(6);
            yield this._userModel.updateUserDetailToDB(user.data.id, { authenticationCode: code });
            yield this._mailRepo.sendPasswordResetEmail(emailAddress, { name: user.data.name, code, subject: email_subject_enum_1.default.VERIFY_TO_CHANGE_PASSWORD });
        });
        this.confirmResetPassword = (code, password) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { emailAddress } = this._authRepo.decryptToken(code, auth_1.TokenType.resetPassword);
                const user = yield this._userModel.checkIfExist({ emailAddress, authenticationCode: code });
                if (user == null)
                    return [ERROR_RESET_PASSWORD_TOKEN_EXPIRED];
                const newPassword = this._authRepo.encryptPassword(password);
                yield this._userModel.updateUserDetailToDB((_a = user.data) === null || _a === void 0 ? void 0 : _a.id, { password: newPassword, authenticationCode: undefined, });
                return null;
            }
            catch (_b) {
                return [ERROR_RESET_PASSWORD_TOKEN_EXPIRED];
            }
        });
        this.getReferalInfo = (referalCode) => __awaiter(this, void 0, void 0, function* () {
            const referalCodes = {
                analytics: {
                    totalAmount: 0,
                    totalEarned: 0,
                    level1: {
                        amount: 0,
                        earned: 0
                    },
                    level2: {
                        amount: 0,
                        earned: 0
                    },
                    level3: {
                        amount: 0,
                        earned: 0
                    }
                }
            };
            if (referalCode) {
                const userWith1stReferalExists = yield this._userModel.checkIfReferalExist({ myReferalCode: referalCode });
                if (!userWith1stReferalExists.data)
                    return { status: false, errors: [ERROR_NO_USER_WITH_THIS_REFCODE] };
                referalCodes.referalCode1 = referalCode;
                const userWith2ndReferalExists = yield this._userModel.checkIfReferalExist({ myReferalCode: userWith1stReferalExists.data.referal.referalCode1 });
                if (userWith2ndReferalExists.data) {
                    referalCodes.referalCode2 = userWith1stReferalExists.data.referal.referalCode1;
                }
                const userWith3rdReferalExists = yield this._userModel.checkIfReferalExist({ myReferalCode: userWith1stReferalExists.data.referal.referalCode2 });
                if (userWith3rdReferalExists.data) {
                    referalCodes.referalCode3 = userWith1stReferalExists.data.referal.referalCode2;
                }
            }
            return { status: true, referalCodes };
        });
        this._mailRepo = mailRepo;
        this._userModel = userModel;
        this._authRepo = authRepo;
        this._raiderUserServiceModel = raiderUserServiceModel;
        this._moderatorUserServiceModel = moderatorUserServiceModel;
        this._cryptoRepository = cryptoRepository;
    }
}
exports.default = UserAuthService;
