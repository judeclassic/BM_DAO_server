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
class UserAuthController {
    constructor({ authValidator, userAuthService }) {
        this.registerUser = ({ body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._userAuthValidator.validateBeforeRegistration(Object.assign({}, body));
            if (validationErrors.length > 0) {
                return sendJson(400, {
                    error: validationErrors,
                    code: 400,
                    status: false
                });
            }
            const { name, emailAddress, username, password, country, accountType, referalCode } = body;
            const { user, errors } = yield this._userAuthService.registerUser({ name, emailAddress, username, password, country, accountType, referalCode });
            if (errors && errors.length > 0)
                return sendJson(401, {
                    error: errors,
                    code: 401,
                    status: false
                });
            if (user === null)
                return sendJson(401, {
                    code: 401,
                    status: false
                });
            return sendJson(201, {
                data: user.getResponse,
                code: 201,
                status: true
            });
        });
        this.loginUser = ({ body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._userAuthValidator.login(Object.assign({}, body));
            if (validationErrors.length > 0) {
                return sendJson(403, { code: 403, status: false, error: validationErrors });
            }
            const { emailAddress, password } = body;
            const response = yield this._userAuthService.loginUser({ emailAddress, password });
            if (!response.user)
                return sendJson(403, {
                    status: false,
                    code: 403,
                    error: response.errors
                });
            return sendJson(200, {
                status: true,
                code: 200,
                data: response.user.getResponse,
            });
        });
        this.resetPassword = ({ body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const { email } = body;
            const validationErrors = this._userAuthValidator.resetPassword(Object.assign({}, body));
            if (validationErrors.length > 0)
                return sendJson(400, {
                    status: false,
                    code: 400,
                    error: validationErrors
                });
            yield this._userAuthService.resetPassword(email);
            return sendJson(201, {
                status: true,
                code: 201,
            });
        });
        this.confirmResetPassword = ({ body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const { emailAddress, code, password, confirmPassword } = body;
            const validationErrors = this._userAuthValidator.confirmResetPassword({ emailAddress, code, password, confirmPassword });
            if (validationErrors.length > 0)
                return sendJson(400, {
                    status: false,
                    code: 400,
                    error: validationErrors
                });
            const errors = yield this._userAuthService.confirmResetPassword(code, password);
            if (errors != null)
                return sendJson(400, { status: false, code: 400, error: errors });
            return sendJson(201, {
                status: true,
                code: 201,
            });
        });
        this.logout = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const { token } = body;
            if (token == null)
                return sendJson(401, { code: 401, status: false });
            yield this._userAuthService.logoutUser(user.id);
            return sendJson(201, { code: 201, status: true });
        });
        this._userAuthValidator = authValidator;
        this._userAuthService = userAuthService;
    }
}
exports.default = UserAuthController;
// how to validate email?
