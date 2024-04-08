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
const user_dto_1 = require("../../../../../types/dtos/user.dto");
const chat_cliamable_response_1 = require("../../../../../types/interfaces/response/services/chatter/chat_cliamable.response");
const enums_1 = require("../../../../../types/interfaces/response/services/enums");
const raider_task_response_1 = require("../../../../../types/interfaces/response/task/raider_task.response");
const transaction_response_1 = require("../../../../../types/interfaces/response/transaction.response");
const user_response_1 = require("../../../../../types/interfaces/response/user.response");
const ERROR_UNABLE_TO_CREATE_TASK = {
    field: 'user',
    message: 'unable to create task',
};
const ERROR_USER_NOT_FOUND = {
    field: 'user',
    message: 'user not found with this user Id',
};
const ERROR_UNABLE_TO_GET_SINGLE_TASK = {
    message: 'unable ',
};
const ERROR_USER_IS_NOT_A_CLIENT = {
    field: 'user',
    message: 'user not found with this user Id',
};
const ERROR_NOT_ENOUGH_BALANCE = {
    message: 'user do not have enough balance please recharge',
};
const ERROR_GETING_ALL_USER_TASKS = {
    message: 'unable to fetch all users tasks',
};
const ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER = {
    message: 'we do not have enough raiders to complete this task',
};
class ChatterClientTaskService {
    constructor({ chatTaskModel, chatterTaskModel, userModel, chatterServiceModel, transactionModel }) {
        this.createTask = (userId, task) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (((_a = user.data) === null || _a === void 0 ? void 0 : _a.accountType) === user_response_1.AccountTypeEnum.user)
                return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };
            const userServiceCountResponse = yield this._chatterServiceModel.countUsersInPlatform({});
            if (userServiceCountResponse.data === undefined) {
                return { errors: [ERROR_USER_NOT_FOUND] };
            }
            if (userServiceCountResponse.data < (task.chatterPerSession * task.hoursPerDay, task.days))
                return { errors: [ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER] };
            user.data.referal.isGiven = true;
            const isWithdrawed = user.data.updateUserWithdrawableBalance({
                amount: user_dto_1.AmountEnum.chatterCharge,
                multiplier: (task.chatterPerSession * task.hoursPerDay, task.days),
                type: 'charged'
            });
            if (!isWithdrawed)
                return { errors: [ERROR_NOT_ENOUGH_BALANCE] };
            const updatedUser = yield this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
            if (!updatedUser.data) {
                return { errors: [ERROR_UNABLE_TO_CREATE_TASK] };
            }
            const endDate = new Date(Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24));
            const createdTask = yield this._chatterTaskModel.saveTaskToDB({
                userId: userId,
                startedAt: new Date(task.startDate),
                endedAt: endDate,
                chatInformation: {
                    serviceType: enums_1.ServiceAccountTypeEnum.chatter,
                    postLink: task.postLink,
                    compaignCaption: task.compaignCaption,
                    chatterPerSession: task.chatterPerSession,
                    hoursPerDay: task.hoursPerDay,
                    startDate: task.startDate,
                    days: task.days,
                },
                availableTask: (task.chatterPerSession * task.hoursPerDay, task.days),
                totalTasks: (task.chatterPerSession * task.hoursPerDay, task.days),
                completedTasks: 0,
                updatedAt: new Date(),
                createdAt: new Date(),
                isVerified: false,
                startTimeLine: Date.parse((new Date(task.startDate)).toISOString()),
                endTimeLine: Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24),
                level: raider_task_response_1.TaskPriorityEnum.low
            });
            if (!createdTask.data) {
                return { errors: [ERROR_UNABLE_TO_CREATE_TASK] };
            }
            const claimableTask = [];
            for (let dayNum = 0; dayNum < task.days; dayNum++) {
                let startDay = new Date(task.startDate);
                let startDayNum = Date.parse(startDay.toISOString()) + ((dayNum) * 24 * 60 * 60 * 1000);
                for (let timeNum = 0; timeNum < task.hoursPerDay; timeNum++) {
                    let startTime = startDayNum + ((timeNum + 1) * 60 * 60 * 1000);
                    for (let userNum = 0; userNum < task.chatterPerSession; userNum++) {
                        let response = this._chatTaskModel.createTask({
                            assignerId: userId,
                            taskId: createdTask.data.id,
                            task: createdTask.data.id,
                            startTime: startTime,
                            endTime: startTime + (60 * 60 * 1000),
                            timeLine: (60 * 60 * 1000),
                            taskStatus: chat_cliamable_response_1.TaskStatusStatus.PENDING
                        });
                        claimableTask.push(response);
                    }
                }
            }
            this._transactionModel.saveTransaction({
                name: updatedUser.data.name,
                userId: user.data.id,
                updatedAt: new Date(),
                createdAt: new Date(),
                transactionType: transaction_response_1.TransactionTypeEnum.TASK_CREATION,
                transactionStatus: transaction_response_1.TransactionStatusEnum.COMPLETED,
                amount: (user_dto_1.AmountEnum.chatterCharge * (task.chatterPerSession * task.hoursPerDay, task.days)),
                isVerified: true,
            });
            // let taskArray = await Promise.all(claimableTask);
            // console.log(taskArray)
            // for (let task of taskArray) {
            //   if (task.data) {
            //     createdTask.data.claimableTask.push(task.data)
            //   }
            // }
            this._userModel.updateUpdatedAnalytics(userId, enums_1.ServiceAccountTypeEnum.raider);
            return { task: createdTask.data };
        });
        this.getAllUserTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.getAllTask({ userId }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getActiveTasks = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.getFutureTask({ userId }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getUserSingleTask = (userId, taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ userId });
            if (!tasksResponse.data)
                return { errors: [ERROR_UNABLE_TO_GET_SINGLE_TASK] };
            return { task: tasksResponse.data };
        });
        this._chatterTaskModel = chatterTaskModel;
        this._chatTaskModel = chatTaskModel;
        this._userModel = userModel;
        this._chatterServiceModel = chatterServiceModel;
        this._transactionModel = transactionModel;
    }
}
exports.default = ChatterClientTaskService;
