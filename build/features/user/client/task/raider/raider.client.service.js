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
const ERROR_UNABLE_TO_UPDATE_USER_BALANCE = {
    message: 'unable to update user balance',
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
class RaiderClientTaskService {
    constructor({ raiderTaskModel, userModel, raiderServiceModel, transactionModel }) {
        this.createRaidTask = (userId, task) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (((_a = user.data) === null || _a === void 0 ? void 0 : _a.accountType) === user_response_1.AccountTypeEnum.user)
                return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };
            user.data.referal.isGiven = true;
            const isWithdrawed = user.data.updateUserWithdrawableBalance({
                amount: user_dto_1.AmountEnum.raidClientCharge1,
                multiplier: task.dailyPost * task.raidersNumber * task.weeks * 7,
                type: 'charged'
            });
            if (!isWithdrawed)
                return { errors: [ERROR_NOT_ENOUGH_BALANCE] };
            const userServiceResponse = yield this._raiderServiceModel.countUsersInPlatform({});
            if (!userServiceResponse.data) {
                return { errors: [ERROR_USER_NOT_FOUND] };
            }
            if (userServiceResponse.data < task.raidersNumber)
                return { errors: [ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER] };
            const updatedUser = yield this._userModel.checkIfExist({ _id: userId });
            if (!updatedUser.data)
                return { errors: [ERROR_UNABLE_TO_UPDATE_USER_BALANCE] };
            const createdTasks = [];
            for (let i = 0; i < (7 * task.weeks); i++) {
                const startDate = Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24 * (i));
                const endDate = Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24 * (i + 1));
                for (let j = 0; j < task.dailyPost; j++) {
                    const actions = Object.values(raider_task_response_1.RaidActionEnum);
                    for (const element of actions) {
                        const createdTask = yield this._raiderTaskModel.saveTaskToDB({
                            userId: userId,
                            startedAt: new Date(startDate),
                            endedAt: new Date(endDate),
                            raidInformation: {
                                action: element,
                                raidLink: task.raidLink,
                                campaignCaption: task.compaignCaption,
                                amount: task.raidersNumber,
                            },
                            availableRaids: task.raidersNumber,
                            totalRaids: task.raidersNumber,
                            completedRaids: 0,
                            updatedAt: new Date(),
                            createdAt: new Date(),
                            isVerified: false,
                            startTimeLine: startDate,
                            endTimeLine: endDate,
                            level: raider_task_response_1.TaskPriorityEnum.high
                        });
                        if (!createdTask.data) {
                            return { errors: [ERROR_UNABLE_TO_CREATE_TASK] };
                        }
                        createdTasks.push(createdTask.data);
                    }
                }
            }
            return { tasks: createdTasks };
        });
        this.createTask = (userId, task) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const user = yield this._userModel.checkIfExist({ _id: userId });
            if (!user.data)
                return { errors: [ERROR_USER_NOT_FOUND] };
            if (((_b = user.data) === null || _b === void 0 ? void 0 : _b.accountType) === user_response_1.AccountTypeEnum.user)
                return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };
            user.data.referal.isGiven = true;
            const isWithdrawed = user.data.updateUserWithdrawableBalance({ amount: user_dto_1.AmountEnum.raidClientCharge2, multiplier: task.numbers, type: 'charged' });
            if (!isWithdrawed)
                return { errors: [ERROR_NOT_ENOUGH_BALANCE] };
            const updatedUser = yield this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
            if (!updatedUser.data) {
                return { errors: [ERROR_UNABLE_TO_CREATE_TASK] };
            }
            const userServiceResponse = yield this._raiderServiceModel.countUsersInPlatform({});
            if (!userServiceResponse.data) {
                return { errors: [ERROR_USER_NOT_FOUND] };
            }
            if (userServiceResponse.data < task.numbers)
                return { errors: [ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER] };
            const endDate = new Date(Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24));
            const createdTask = yield this._raiderTaskModel.saveTaskToDB({
                userId: userId,
                startedAt: new Date(task.startDate),
                endedAt: endDate,
                raidInformation: {
                    action: task.action,
                    raidLink: task.raidLink,
                    campaignCaption: task.campaignCaption,
                    amount: task.numbers,
                },
                availableRaids: task.numbers,
                totalRaids: task.numbers,
                completedRaids: 0,
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
            this._transactionModel.saveTransaction({
                name: updatedUser.data.name,
                userId: user.data.id,
                updatedAt: new Date(),
                createdAt: new Date(),
                transactionType: transaction_response_1.TransactionTypeEnum.TASK_CREATION,
                transactionStatus: transaction_response_1.TransactionStatusEnum.COMPLETED,
                amount: (user_dto_1.AmountEnum.raidUserPay1 * task.numbers),
                isVerified: true,
            });
            this._userModel.updateUpdatedAnalytics(userId, enums_1.ServiceAccountTypeEnum.raider);
            return { task: createdTask.data };
        });
        this.getAllUserTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getAllTask({ userId }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getActiveTasks = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.getFutureTask({ userId }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getUserSingleTask = (userId, taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._raiderTaskModel.checkIfExist({ userId });
            if (!tasksResponse.data)
                return { errors: [ERROR_UNABLE_TO_GET_SINGLE_TASK] };
            return { task: tasksResponse.data };
        });
        this._raiderTaskModel = raiderTaskModel;
        this._userModel = userModel;
        this._raiderServiceModel = raiderServiceModel;
        this._transactionModel = transactionModel;
    }
}
exports.default = RaiderClientTaskService;
