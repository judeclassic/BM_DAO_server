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
class UserRaidController {
    constructor({ taskValidator, raiderTaskService }) {
        this.getAllActiveTask = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._raiderUserTaskService.getAllActiveTask(user.id, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.getAllOtherTask = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._raiderUserTaskService.getAllOtherTask(user.id, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.startRaidTask = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._raiderUserTaskService.startRaidTask(user.id, body.taskId, body.serviceId);
            if (!response.raid) {
                sendJson(401, { error: response.errors, code: 401, status: false });
                return;
            }
            sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
        });
        this.completeRaidTask = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(body.raidId);
            if (validationErrors.length > 0) {
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            }
            const response = yield this._raiderUserTaskService.completeRaidTask(user.id, body.raidId);
            if (!response.raid) {
                sendJson(401, { error: response.errors, code: 401, status: false });
                return;
            }
            sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
        });
        this.getAllUserRaid = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._raiderUserTaskService.getAllUsersRaids(user.id, query);
            if (!response.tasks) {
                sendJson(401, { error: response.errors, code: 401, status: false });
                return;
            }
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.getUserSingleRaid = ({ params, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(params.raidId);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._raiderUserTaskService.getUserSingleRaid(params.raidId);
            if (!response.raid)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
        });
        this.viewUserSingle = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._raiderUserTaskService.startRaidTask(user.id, body.taskId, body.serviceId);
            if (!response.raid) {
                sendJson(401, { error: response.errors, code: 401, status: false });
                return;
            }
            sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
        });
        this._taskValidator = taskValidator;
        this._raiderUserTaskService = raiderTaskService;
    }
}
exports.default = UserRaidController;
