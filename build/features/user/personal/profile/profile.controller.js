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
class UserProfileController {
    constructor({ userService, userValidator }) {
        this.getUser = ({ params }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            if (!userId) {
                return sendJson(403, {
                    code: 403,
                    status: false,
                });
            }
            const foundUser = yield this._userService.findUserById(userId);
            if (foundUser === null) {
                return sendJson(401, {
                    error: [{ message: 'User is not found' }],
                    status: false,
                    code: 401
                });
            }
            return sendJson(200, {
                status: true,
                code: 200,
                data: foundUser.getUnSecureResponse
            });
        });
        this.viewProfile = ({ user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            if (!user.id)
                return sendJson(403, { code: 403, status: false });
            const foundUser = yield this._userService.findUserById(user.id);
            if (!foundUser)
                return sendJson(401, { error: [{ message: 'User is not found' }], status: false, code: 401 });
            return sendJson(200, { status: true, code: 200, data: foundUser.getResponse });
        });
        this.getUserReferals = ({ user, params }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            if (!user.id)
                return sendJson(403, { code: 403, status: false });
            const foundUser = yield this._userService.getUserReferals(user.id, params.level);
            if (!foundUser.data)
                return sendJson(401, { error: [{ message: 'User is not found' }], status: false, code: 401 });
            return sendJson(200, { status: true, code: 200, data: foundUser.data.getResponse });
        });
        this.updateProfile = ({ user, body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._userValidator.validateBeforePersonalUpdate(Object.assign({}, body));
            if (validationErrors.length > 0) {
                return sendJson(400, {
                    error: validationErrors,
                    code: 400,
                    status: false
                });
            }
            const { id } = user;
            if (!id) {
                return sendJson(403, {
                    code: 403,
                    status: false,
                });
            }
            const { name, phoneNumber, country } = body;
            const foundUser = yield this._userService.updateProfileInformation(id, { name, phoneNumber, country });
            if (!foundUser.user) {
                return sendJson(401, {
                    error: [{ message: 'User is not found' }],
                    status: false,
                    code: 401
                });
            }
            return sendJson(200, {
                status: true,
                code: 200,
                data: foundUser.user.getResponse
            });
        });
        this._userService = userService;
        this._userValidator = userValidator;
    }
}
exports.default = UserProfileController;
