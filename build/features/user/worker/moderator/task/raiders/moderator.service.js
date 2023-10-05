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
const raider_task_response_1 = require("../../../../../../types/interfaces/response/task/raider_task.response");
const ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE = {
    field: 'userId',
    message: 'this user have not subscribed to be a moderator',
};
const ERROR_UNABLE_TO_GET_TASK = {
    field: 'taskId',
    message: 'unable to get this task',
};
const ERROR_USER_IS_NOT_A_CLIENT = {
    field: 'user',
    message: 'user not found with this user Id',
};
const ERROR_GETING_ALL_USER_TASKS = {
    message: 'unable to fetch all users tasks',
};
const ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER = {
    message: 'this service do not belong to the user',
};
const ERROR_THIS_TASK_HAS_A_MODERATOR_ALREADY = {
    message: 'This task already have a moderator',
};
const ERROR_THIS_TASK_IS_ALREADY_MODERATED_BY_YOU = {
    message: 'This task is being moderated by you already',
};
class ModeratorUserTaskService {
    constructor({ raiderTaskModel, raidModel, moderatorServiceModel }) {
        this.getAllActiveTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getActiveTask({ level: raider_task_response_1.TaskPriorityEnum.high, isModerated: false }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllOtherTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getActiveTask({ level: raider_task_response_1.TaskPriorityEnum.low, isModerated: false }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllModeratorTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getActiveTask({ moderatorId: userId, level: raider_task_response_1.TaskPriorityEnum.high }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllModeratorOtherTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getActiveTask({ moderatorId: userId, level: raider_task_response_1.TaskPriorityEnum.low }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getRaiderSingleRaid = (raidId) => __awaiter(this, void 0, void 0, function* () {
            const raidsResponse = yield this._raidModel.checkIfExist({ _id: raidId });
            if (!raidsResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: raidsResponse.data.taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            raidsResponse.data.addTaskToModel = tasksResponse.data;
            return { raid: raidsResponse.data };
        });
        this.getModeratorTask = (taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: taskId, level: raider_task_response_1.TaskPriorityEnum.high });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { task: tasksResponse.data };
        });
        this.moderateTask = (userId, taskId, serviceId) => __awaiter(this, void 0, void 0, function* () {
            const userService = yield this._moderatorServiceModel.checkIfExist({ _id: serviceId });
            if (!userService.data)
                return { errors: [ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE] };
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_UNABLE_TO_GET_TASK] };
            if (userService.data.userId !== userId)
                return { errors: [ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER] };
            if (!userService.data.isUserSubscribed)
                return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };
            if (tasksResponse.data.moderatorId === userId)
                return { errors: [ERROR_THIS_TASK_IS_ALREADY_MODERATED_BY_YOU] };
            if (tasksResponse.data.isModerated)
                return { errors: [ERROR_THIS_TASK_HAS_A_MODERATOR_ALREADY] };
            tasksResponse.data.addModerator = userService.data;
            const updatedTaskResponse = yield this._raiderTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
            return { task: updatedTaskResponse.data };
        });
        this.getModeratorRaidersRaid = (taskId, option) => __awaiter(this, void 0, void 0, function* () {
            const raidsResponse = yield this._raidModel.getAllRaid({ taskId }, option);
            if (!raidsResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { raids: raidsResponse.data };
        });
        this.rejectRaid = (userId, raidId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ moderatorId: userId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const raidResponse = yield this._raidModel.checkIfExist({ _id: raidId });
            if (!raidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            if (raidResponse.data.taskId === tasksResponse.data._id)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            tasksResponse.data.modifyUserRaidsNumber('remove');
            const updatedTaskResponse = yield this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            raidResponse.data.addTaskToModel = updatedTaskResponse.data;
            return { raid: raidResponse.data };
        });
        this.approveTaskAsComplete = (userId, taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const updatedTaskResponse = yield this._raiderTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { task: updatedTaskResponse.data };
        });
        this._raidModel = raidModel;
        this._raiderTaskModel = raiderTaskModel;
        this._moderatorServiceModel = moderatorServiceModel;
    }
}
exports.default = ModeratorUserTaskService;
