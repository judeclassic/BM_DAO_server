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
const enums_1 = require("../../../../../types/interfaces/response/services/enums");
const raid_response_1 = require("../../../../../types/interfaces/response/services/raid.response");
const ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE = {
    field: 'serviceId',
    message: 'this user have not subscribed top be a raider',
};
const ERROR_UNABLE_TO_GET_TASK = {
    field: 'taskId',
    message: 'unable to get this task',
};
const ERROR_USER_IS_NOT_A_USER = {
    field: 'serviceId',
    message: 'This raider account is expired please subscribe again',
};
const ERROR_GETING_ALL_USER_TASKS = {
    message: 'unable to fetch all users tasks',
};
const ERROR_TASK_HAVE_BEEN_FILLED_UP = {
    message: 'this task have been filled with users',
};
const ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER = {
    message: 'this service do not belong to the user',
};
const ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER = {
    message: 'this raid was not created by this user',
};
class ChatterWorkTaskService {
    constructor({ chatterTaskModel, chatModel, chatterServiceModel, userModel }) {
        this.getAllUsersRaids = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatModel.getAllTask({ assigneeId: userId }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getUserSingleRaid = (raidId) => __awaiter(this, void 0, void 0, function* () {
            const raidsResponse = yield this._chatModel.checkIfExist({ _id: raidId });
            if (!raidsResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ _id: raidsResponse.data.taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            raidsResponse.data.addTaskToModel = tasksResponse.data;
            return { chat: raidsResponse.data };
        });
        this.startChatTask = (userId, chatId, serviceId) => __awaiter(this, void 0, void 0, function* () {
            const userService = yield this._chatterServiceModel.checkIfExist({ _id: serviceId });
            if (!userService.data)
                return { errors: [ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE] };
            if (userService.data.userId !== userId)
                return { errors: [ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER] };
            if (!userService.data.isUserSubscribed)
                return { errors: [ERROR_USER_IS_NOT_A_USER] };
            const chatTaskResponse = yield this._chatterTaskModel.checkIfExist({ _id: chatId });
            if (!chatTaskResponse.data)
                return { errors: [ERROR_UNABLE_TO_GET_TASK] };
            const chatResponse = yield this._chatModel.checkIfExist({ _id: chatId });
            if (!chatResponse.data)
                return { errors: [ERROR_UNABLE_TO_GET_TASK] };
            if (!chatResponse.data.assigneeId !== undefined)
                return { errors: [ERROR_TASK_HAVE_BEEN_FILLED_UP] };
            chatTaskResponse.data.modifyUserChattersNumber('add');
            const updatedTaskResponse = yield this._chatterTaskModel.updateTaskDetailToDB(chatResponse.data.taskId, chatTaskResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            this._chatterServiceModel.updateCreatedAnalytics(userId);
            this._userModel.updateCompletedAnalytics(userId, enums_1.ServiceAccountTypeEnum.raider);
            return { chat: chatResponse.data };
        });
        this.cancelRaidTask = (userId, raidId) => __awaiter(this, void 0, void 0, function* () {
            const chatResponse = yield this._chatModel.checkIfExist({ _id: raidId });
            if (!chatResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            if (chatResponse.data.assigneeId !== userId)
                return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };
            const chatTaskResponse = yield this._chatterTaskModel.checkIfExist({ _id: chatResponse.data.taskId });
            if (!chatTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            chatTaskResponse.data.modifyUserChattersNumber('remove');
            const updatedTaskResponse = yield this._chatterTaskModel.updateTaskDetailToDB(chatResponse.data.taskId, chatTaskResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const updatedChatResponse = yield this._chatModel.updateTask(chatResponse.data.id, chatTaskResponse.data.getDBModel);
            if (!updatedChatResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            updatedChatResponse.data.addTaskToModel = updatedTaskResponse.data;
            updatedChatResponse.data.assigneeId
                && this._chatterServiceModel.updateCancelAnalytics(updatedChatResponse.data.assigneeId);
            this._userModel.updateCancelAnalytics(userId, enums_1.ServiceAccountTypeEnum.raider);
            return { raid: updatedChatResponse.data };
        });
        this.completeRaidTask = (userId, raidId, proofs) => __awaiter(this, void 0, void 0, function* () {
            const raidResponse = yield this._chatModel.checkIfExist({ _id: raidId });
            if (!raidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            if (raidResponse.data.assigneeId !== userId)
                return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ _id: raidResponse.data.taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const updateRaidResponse = yield this._chatModel.updateTask(raidId, { proofs, taskStatus: raid_response_1.TaskStatusStatus.COMPLETED });
            if (!updateRaidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            tasksResponse.data.modifyUserChattersNumber('complete');
            const updatedTaskResponse = yield this._chatterTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            raidResponse.data.addTaskToModel = updatedTaskResponse.data;
            this._chatterServiceModel.updateCompletedAnalytics(raidResponse.data.assigneeId);
            this._userModel.updateCompletedAnalytics(raidResponse.data.assigneeId, enums_1.ServiceAccountTypeEnum.raider);
            return { chat: raidResponse.data };
        });
        this._chatterTaskModel = chatterTaskModel;
        this._chatModel = chatModel;
        this._chatterServiceModel = chatterServiceModel;
        this._userModel = userModel;
    }
}
exports.default = ChatterWorkTaskService;
