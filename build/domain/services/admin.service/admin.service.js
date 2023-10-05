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
const admin_dto_1 = __importDefault(require("../../../types/dtos/admin.dto"));
const auth_1 = require("../../../types/interfaces/modules/auth");
const admin_response_1 = require("../../../types/interfaces/response/admin.response");
const ERROR_USER_ALREADY_EXISTS = {
    field: 'email',
    message: 'A user with this email already exists.',
};
const ERROR_USER_NOT_FOUND = {
    field: 'password',
    message: 'User with this email or password combination does not exist.',
};
const ERROR_UNABLE_TO_SAVE_USER = {
    message: 'Unable to save user data on DB',
};
const ERROR_INVALID_TOKEN = {
    field: 'token',
    message: 'The provided token was invalid.',
};
const ERROR_USER_ALREADY_VERIFIED = {
    message: 'This email is already verified.',
};
const ERROR_RESET_PASSWORD_TOKEN_EXPIRED = {
    message: 'This token has expired. Please request a new password reset.',
};
class AdminService {
    constructor({ authRepo, adminModel }) {
        this.createAdmin = (registrantId, admin) => __awaiter(this, void 0, void 0, function* () {
            const registrant = yield this._adminModel.checkIfExist({ _id: registrantId });
            if (!registrant.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (registrant.data.accessStatus !== admin_response_1.AccessStatusEnum.THREE) {
                return { errors: [ERROR_USER_NOT_FOUND] };
            }
            const userExists = yield this.findUserByEmail(admin.emailAddress);
            if (userExists != null) {
                return { errors: [ERROR_USER_ALREADY_EXISTS] };
            }
            const hashedPassword = this._authRepo.encryptPassword(admin.password);
            const verificationCode = this._authRepo.generateVerificationCode(6);
            const user = yield this._adminModel.saveAdminToDB({
                name: admin.name,
                emailAddress: admin.emailAddress,
                password: hashedPassword,
                authenticationCode: verificationCode,
                accessStatus: admin_response_1.AccessStatusEnum.ONE
            });
            if (!user.data) {
                return { errors: [ERROR_UNABLE_TO_SAVE_USER] };
            }
            const adminDto = new admin_dto_1.default(user.data);
            const accessToken = this._authRepo.encryptToken(adminDto.forToken(), auth_1.TokenType.accessToken);
            adminDto.accessToken = accessToken;
            return { user: adminDto };
        });
        this.loginAdmin = ({ emailAddress, password }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._adminModel.checkIfExist({ emailAddress });
            if (user == null)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (user.error || !user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const passwordIsValid = yield this._authRepo.comparePassword(password, user.data.password);
            if (!passwordIsValid)
                return { errors: [ERROR_USER_NOT_FOUND] };
            const finalAdminDto = new admin_dto_1.default(user.data);
            const accessToken = this._authRepo.encryptToken(finalAdminDto.forToken(), auth_1.TokenType.adminAccessToken);
            finalAdminDto.accessToken = accessToken;
            this._adminModel.updateAdminDetailToDB(finalAdminDto.id, { accessToken });
            return { admin: finalAdminDto };
        });
        this.logoutUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            this._adminModel.updateAdminDetailToDB(userId, { accessToken: undefined });
        });
        this.verifyEmailWithCode = (emailAddress, code) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._adminModel.checkIfExist({ emailAddress, authenticationCode: code });
                if (user == null || user.error || !user.data)
                    return [ERROR_INVALID_TOKEN];
                if (user.data.isVerified)
                    return [ERROR_USER_ALREADY_VERIFIED];
                yield this._adminModel.updateAdminDetailToDB(user.data._id, { authenticationCode: undefined });
                return null;
            }
            catch (_a) {
                return [ERROR_INVALID_TOKEN];
            }
        });
        this.confirmResetPassword = (code, password) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const { emailAddress } = this._authRepo.decryptToken(code, auth_1.TokenType.resetPassword);
                const user = yield this._adminModel.checkIfExist({ emailAddress, authenticationCode: code });
                if (user == null)
                    return [ERROR_RESET_PASSWORD_TOKEN_EXPIRED];
                const newPassword = this._authRepo.encryptPassword(password);
                yield this._adminModel.updateAdminDetailToDB((_b = user.data) === null || _b === void 0 ? void 0 : _b._id, { password: newPassword, authenticationCode: undefined, });
                return null;
            }
            catch (_c) {
                return [ERROR_RESET_PASSWORD_TOKEN_EXPIRED];
            }
        });
        this.findUserByEmail = (emailAddress) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._adminModel.checkIfExist({ emailAddress });
            if (user.error || !user.data) {
                return null;
            }
            return new admin_dto_1.default(user.data);
        });
        this.findUserById = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._adminModel.checkIfExist({ _id: userId });
            if (user.error || !user.data) {
                return null;
            }
            return new admin_dto_1.default(user.data);
        });
        this._adminModel = adminModel;
        this._authRepo = authRepo;
    }
}
exports.default = AdminService;
