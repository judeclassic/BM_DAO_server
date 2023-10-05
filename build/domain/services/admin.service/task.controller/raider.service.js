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
const raider_task_response_1 = require("../../../../types/interfaces/response/task/raider_task.response");
const ERROR_GETING_ALL_USER_TASKS = {
    message: 'unable to fetch all users tasks',
};
const ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER = {
    message: 'this raid was not created by this user',
};
class RaiderAdminTaskService {
    constructor({ raiderTaskModel, userModel, raidModel, raiderServiceModel }) {
        this.getAllActiveTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getActiveTask({ level: raider_task_response_1.TaskPriorityEnum.high }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllOtherTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getActiveTask({ level: raider_task_response_1.TaskPriorityEnum.low }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllUsersRaids = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raidModel.getAllRaid({}, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.disapproveRaid = (userId, raidId) => __awaiter(this, void 0, void 0, function* () {
            const raidResponse = yield this._raidModel.checkIfExist({ _id: raidId });
            if (!raidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            if (raidResponse.data.assigneeId !== userId)
                return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: raidResponse.data.taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const updatedTaskResponse = yield this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            raidResponse.data.addTaskToModel = updatedTaskResponse.data;
            return { raid: raidResponse.data };
        });
        this.approveRaids = (userId, raidId) => __awaiter(this, void 0, void 0, function* () {
            const raidResponse = yield this._raidModel.checkIfExist({ _id: raidId });
            if (!raidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            if (raidResponse.data.assigneeId !== userId)
                return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: raidResponse.data.taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const updatedTaskResponse = yield this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            raidResponse.data.addTaskToModel = updatedTaskResponse.data;
            return { raid: raidResponse.data };
        });
        this._raiderTaskModel = raiderTaskModel;
        this._userModel = userModel;
        this._raidModel = raidModel;
        this._raiderServiceModel = raiderServiceModel;
    }
}
exports.default = RaiderAdminTaskService;
