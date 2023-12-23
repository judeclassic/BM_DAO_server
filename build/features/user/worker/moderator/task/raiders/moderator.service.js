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
const raiders_dto_1 = require("../../../../../../types/dtos/task/raiders.dto");
const enums_1 = require("../../../../../../types/interfaces/response/services/enums");
const raid_response_1 = require("../../../../../../types/interfaces/response/services/raid.response");
const raider_task_response_1 = require("../../../../../../types/interfaces/response/task/raider_task.response");
const transaction_response_1 = require("../../../../../../types/interfaces/response/transaction.response");
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
const ERROR_GETTING_THIS_TASK = {
    message: 'Error fetching this task',
};
const ERROR_GETTING_THIS_RAID = {
    message: 'Error fetching this raid',
};
class ModeratorUserTaskService {
    constructor({ raiderTaskModel, raidModel, moderatorServiceModel, raiderServiceModel, userModel, transactionModel }) {
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
        this.getSingleTask = (taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { task: tasksResponse.data };
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
            this._raiderServiceModel.updateCreatedAnalytics(userId);
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
                return { errors: [ERROR_GETTING_THIS_RAID] };
            if (raidResponse.data.taskStatus === raid_response_1.TaskStatusStatus.APPROVED)
                return { errors: [{ message: 'this raid has been approved already' }] };
            if (raidResponse.data.taskStatus === raid_response_1.TaskStatusStatus.REJECTED)
                return { errors: [{ message: 'this raid has been rejected already' }] };
            if (raidResponse.data.taskId === tasksResponse.data._id)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            tasksResponse.data.modifyUserRaidsNumber('remove');
            const updatedRaidResponse = yield this._raidModel.updateRaid(raidId, { taskStatus: raid_response_1.TaskStatusStatus.REJECTED });
            if (!updatedRaidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            const updatedTaskResponse = yield this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            updatedRaidResponse.data.addTaskToModel = updatedTaskResponse.data;
            this._raiderServiceModel.updateCancelAnalytics(updatedRaidResponse.data.assigneeId);
            return { raid: updatedRaidResponse.data };
        });
        this.approveRaid = (userId, raidId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ moderatorId: userId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_THIS_TASK] };
            const raidResponse = yield this._raidModel.checkIfExist({ _id: raidId });
            if (!raidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            if (raidResponse.data.taskId === tasksResponse.data._id)
                return { errors: [ERROR_GETTING_THIS_RAID] };
            if (raidResponse.data.taskStatus === raid_response_1.TaskStatusStatus.APPROVED)
                return { errors: [{ message: 'this raid has been approved already' }] };
            if (raidResponse.data.taskStatus === raid_response_1.TaskStatusStatus.REJECTED)
                return { errors: [{ message: 'this raid has been rejected already' }] };
            const updatedRaidResponse = yield this._raidModel.updateRaid(raidId, { taskStatus: raid_response_1.TaskStatusStatus.APPROVED });
            if (!updatedRaidResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            updatedRaidResponse.data.addTaskToModel = tasksResponse.data;
            yield Promise.all([
                this._userModel.updateBalance(updatedRaidResponse.data.assigneeId, raiders_dto_1.RaiderTaskDto.getPricingByAction((_a = tasksResponse.data) === null || _a === void 0 ? void 0 : _a.raidInformation.action)),
                this._transactionModel.saveTransaction({
                    name: transaction_response_1.TransactionTypeEnum.RAIDER_SUBSCRIPTION,
                    userId: raidResponse.data.assigneeId,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    transactionType: transaction_response_1.TransactionTypeEnum.RAIDER_SUBSCRIPTION,
                    transactionStatus: transaction_response_1.TransactionStatusEnum.COMPLETED,
                    amount: raiders_dto_1.RaiderTaskDto.getPricingByAction((_b = tasksResponse.data) === null || _b === void 0 ? void 0 : _b.raidInformation.action),
                    isVerified: true,
                })
            ]);
            return { raid: updatedRaidResponse.data };
        });
        this.approveTaskAsComplete = (userId, taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ _id: taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_THIS_TASK] };
            const updatedTaskResponse = yield this._raiderTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            yield this._userModel.updateCompletedAnalytics(tasksResponse.data.userId, enums_1.ServiceAccountTypeEnum.raider);
            const raidsResponse = yield this._raidModel.getAllRaids([{ taskId, taskStatus: raid_response_1.TaskStatusStatus.STARTED }]);
            if (!raidsResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            Promise.all(raidsResponse.data.map((raid) => {
                var _a, _b;
                this._userModel.updateBalance(raid.assigneeId, raiders_dto_1.RaiderTaskDto.getPricingByAction((_a = tasksResponse.data) === null || _a === void 0 ? void 0 : _a.raidInformation.action));
                this._transactionModel.saveTransaction({
                    name: transaction_response_1.TransactionTypeEnum.RAIDER_SUBSCRIPTION,
                    userId: raid.assigneeId,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    transactionType: transaction_response_1.TransactionTypeEnum.RAIDER_SUBSCRIPTION,
                    transactionStatus: transaction_response_1.TransactionStatusEnum.COMPLETED,
                    amount: (raiders_dto_1.RaiderTaskDto.getPricingByAction((_b = tasksResponse.data) === null || _b === void 0 ? void 0 : _b.raidInformation.action)),
                    isVerified: true,
                });
            }));
            this._moderatorServiceModel.updateCompletedAnalytics(userId);
            this._userModel.updateCompletedAnalytics(updatedTaskResponse.data.userId, enums_1.ServiceAccountTypeEnum.raider);
            yield this._raidModel.deleteAllRaids({ taskId });
            return { task: updatedTaskResponse.data };
        });
        this._raidModel = raidModel;
        this._raiderTaskModel = raiderTaskModel;
        this._moderatorServiceModel = moderatorServiceModel;
        this._raiderServiceModel = raiderServiceModel;
        this._userModel = userModel;
        this._transactionModel = transactionModel;
    }
}
exports.default = ModeratorUserTaskService;
