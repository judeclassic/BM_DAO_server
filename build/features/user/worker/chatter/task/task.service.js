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
const chat_cliamable_response_1 = require("../../../../../types/interfaces/response/services/chatter/chat_cliamable.response");
const raider_task_response_1 = require("../../../../../types/interfaces/response/task/raider_task.response");
const ERROR_GETING_ALL_USER_TASKS = {
    message: 'unable to fetch all users tasks',
};
const ERROR_GETING_ALL_USER_CLIAMABLE_TASKS = {
    message: 'unable to fetch all users claimable tasks',
};
class ChatterUserTaskService {
    constructor({ chatTaskModel, chatterTaskModel }) {
        this.getAllActiveTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.getActiveTask({ level: raider_task_response_1.TaskPriorityEnum.high }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllOtherTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.getActiveTask({ level: raider_task_response_1.TaskPriorityEnum.low }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllOtherCliamableTask = (taskId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatTaskModel.getAllTask({ taskId, taskStatus: chat_cliamable_response_1.TaskStatusStatus.PENDING }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getUserSingleTask = (taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ _id: taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const chatResponse = yield this._chatTaskModel.getAllTasks([{ taskId }]);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            if (!chatResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_CLIAMABLE_TASKS] };
            tasksResponse.data.claimableTask = chatResponse.data;
            return { task: tasksResponse.data };
        });
        this._chatTaskModel = chatTaskModel;
        this._chatterTaskModel = chatterTaskModel;
    }
}
exports.default = ChatterUserTaskService;
