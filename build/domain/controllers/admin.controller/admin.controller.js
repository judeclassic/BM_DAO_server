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
class AdminController {
    constructor({ adminValidator, adminService }) {
        this.loginAdmin = ({ body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const validationErrors = this._adminValidator.login(Object.assign({}, body));
            if (validationErrors.length > 0) {
                return sendJson(403, { code: 403, status: false, error: validationErrors });
            }
            const { emailAddress, password } = body;
            const response = yield this._adminService.loginAdmin({ emailAddress, password });
            if (!response.admin)
                return sendJson(403, {
                    status: false,
                    code: 403,
                    error: response.errors
                });
            return sendJson(200, {
                status: true,
                code: 200,
                data: (_a = response.admin) === null || _a === void 0 ? void 0 : _a.getResponse,
            });
        });
        this.viewProfile = ({ user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._adminService.findUserById(user.id);
            if (!response)
                return sendJson(403, {
                    status: false,
                    code: 403,
                    error: [{ message: 'unable to fetch user information' }]
                });
            return sendJson(200, {
                status: true,
                code: 200,
                data: response.getResponse,
            });
        });
        this.logout = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const { token } = body;
            if (token == null)
                return sendJson(401, { code: 401, status: false });
            yield this._adminService.logoutUser(user.id);
            return sendJson(201, { code: 201, status: true });
        });
        this._adminValidator = adminValidator;
        this._adminService = adminService;
    }
}
exports.default = AdminController;
// how to validate email?
