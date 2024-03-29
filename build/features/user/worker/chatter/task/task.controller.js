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
class ChatterUserController {
    constructor({ taskValidator, chatterTaskService }) {
        this.getAllActiveTask = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._chatterTaskService.getAllActiveTask(user.id, query);
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
            const response = yield this._chatterTaskService.getAllOtherTask(user.id, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.getAllOtherCliamableTask = ({ query, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            const validationErrors = this._taskValidator.validateOptions(query);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._chatterTaskService.getAllOtherCliamableTask(query.taskId, query);
            if (!response.tasks)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
        });
        this.getSingleTask = ({ params, user }, sendJson) => __awaiter(this, void 0, void 0, function* () {
            console.log(params);
            const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
            if (validationErrors.length > 0) {
                sendJson(400, { error: validationErrors, code: 400, status: false });
                return;
            }
            const response = yield this._chatterTaskService.getUserSingleTask(params.taskId);
            if (!response.task)
                return sendJson(401, { error: response.errors, code: 401, status: false });
            sendJson(201, { data: response.task.getResponse, code: 201, status: true });
        });
        this._taskValidator = taskValidator;
        this._chatterTaskService = chatterTaskService;
    }
}
exports.default = ChatterUserController;
