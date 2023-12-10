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
class ModeratorUserRaidController {
    constructor({ taskValidator, moderatorUserTaskService }) {
        this.getAllActiveTask = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.getAllActiveTask(user.id, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.getAllOtherTask = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.getAllOtherTask(user.id, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.moderateTask = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.moderateTask(user.id, body.taskId, body.serviceId);
            if (!response.task)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.task.getResponse, code: 201, status: true });
        });
        this.rejectRaid = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(body.raidId);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.rejectRaid(user.id, body.raidId);
            if (!response.raid)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
        });
        this.approveRaid = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(body.raidId);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.rejectRaid(user.id, body.raidId);
            if (!response.raid)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
        });
        this.approveTaskAsComplete = ({ body, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.approveTaskAsComplete(user.id, body.taskId);
            if (!response.task)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.task.getResponse, code: 201, status: true });
        });
        this.getAllModeratorsActiveTasks = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.getAllModeratorTask(user.id, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.getAllModeratorsTasks = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.getAllModeratorOtherTask(user.id, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.getModeratorTask = ({ params, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.getModeratorTask(params.taskId);
            if (!response.task)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.task.getResponse, code: 201, status: true });
        });
        this.getModeratedRaids = ({ params, query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.getModeratorRaidersRaid(params.taskId, query);
            if (!response.raids)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.raids.getResponse, code: 201, status: true });
        });
        this.getUserSingleRaid = ({ params, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateIdBeforeCreation(params.raidId);
            if (validationErrors.length > 0)
                return sendJson(400, { error: validationErrors, code: 400, status: false });
            const response = yield this._moderatorUserTaskService.getRaiderSingleRaid(params.raidId);
            if (!response.raid)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
        });
        this._taskValidator = taskValidator;
        this._moderatorUserTaskService = moderatorUserTaskService;
    }
}
exports.default = ModeratorUserRaidController;
