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
class ModeratorUserServiceController {
    constructor({ userServiceService, userServiceValidator }) {
        this.subscribeUserService = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._userServiceValidator.validateServiceBeforeCreation(body);
            if (validationErrors.length > 0) {
                return sendJson(400, {
                    error: validationErrors,
                    code: 400,
                    status: false
                });
            }
            const { accountType } = body;
            const response = yield this._userServiceService.subscribeForAService({ accountType, userId: user.id });
            if (!response.userService)
                return sendJson(401, {
                    error: response.errors,
                    code: 401,
                    status: false
                });
            if (response.userService === null)
                return sendJson(401, {
                    code: 401,
                    status: false
                });
            return sendJson(201, {
                data: response.userService.getResponse,
                code: 201,
                status: true
            });
        });
        this.reSubscribeUserService = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._userServiceValidator.validateServiceBeforeReSubscribing(body);
            if (validationErrors.length > 0) {
                return sendJson(400, {
                    error: validationErrors,
                    code: 400,
                    status: false
                });
            }
            const { userServiceId } = body;
            const response = yield this._userServiceService.resubscribeAService({ userServiceId, userId: user.id });
            if (!response.userService)
                return sendJson(401, {
                    error: response.errors,
                    code: 401,
                    status: false
                });
            if (response.userService === null)
                return sendJson(401, {
                    code: 401,
                    status: false
                });
            return sendJson(201, {
                data: response.userService.getResponse,
                code: 201,
                status: true
            });
        });
        this.getUserService = ({ user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._userServiceService.getUserService(user.id);
            if (!response.userService) {
                return sendJson(401, {
                    error: response.errors,
                    code: 401,
                    status: false
                });
            }
            return sendJson(200, {
                status: true,
                code: 200,
                data: response.userService.getResponse
            });
        });
        this.listAllUserServices = ({ user, query }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = query;
            const response = yield this._userServiceService.listAllUserServices(user.id, { page, limit });
            if (!response.userServices) {
                return sendJson(401, {
                    error: response.errors,
                    code: 401,
                    status: false
                });
            }
            return sendJson(200, {
                status: true,
                code: 200,
                data: response.userServices.getResponse
            });
        });
        this.unSubscribeFromUserService = ({ user, body }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const { requestId, password } = body;
            const response = yield this._userServiceService.unsubscribeFromUserService(user.id, requestId, password);
            if (!response.userService)
                return sendJson(401, {
                    error: response.errors,
                    code: 401,
                    status: false
                });
            return sendJson(201, {
                data: response.userService.getResponse,
                code: 201,
                status: true
            });
        });
        this._userServiceService = userServiceService;
        this._userServiceValidator = userServiceValidator;
    }
}
exports.default = ModeratorUserServiceController;
