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
const chatters_dto_1 = require("../../../../../../types/dtos/task/chatters.dto");
const user_dto_1 = require("../../../../../../types/dtos/user.dto");
const chat_cliamable_response_1 = require("../../../../../../types/interfaces/response/services/chatter/chat_cliamable.response");
const enums_1 = require("../../../../../../types/interfaces/response/services/enums");
const chatter_task_response_1 = require("../../../../../../types/interfaces/response/task/chatter_task.response");
const transaction_response_1 = require("../../../../../../types/interfaces/response/transaction.response");
const ERROR_GETTING_ALL_USER_TASKS = {
    message: 'unable to fetch all users tasks',
};
const ERROR_GETTING_THIS_USER_SERVICE = {
    message: 'error getting the Chatter service and social handles',
};
const ERROR_GETTING_THIS_TASK = {
    message: 'Error fetching this task',
};
const ERROR_GETTING_THIS_Chat = {
    message: 'Error fetching this Chat',
};
class ModeratorUserTaskService {
    constructor({ chatterTaskModel, chatModel, moderatorServiceModel, chatterServiceModel, userModel, transactionModel }) {
        this.getAllOtherTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.getActiveTask({ level: chatter_task_response_1.TaskPriorityEnum.low }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllModeratorTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.getActiveTask({ moderatorId: userId, level: chatter_task_response_1.TaskPriorityEnum.high }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getAllModeratorOtherTask = (userId, option) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.getActiveTask({ moderatorId: userId, level: chatter_task_response_1.TaskPriorityEnum.low }, option);
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            return { tasks: tasksResponse.data };
        });
        this.getSingleTask = (taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ _id: taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            return { task: tasksResponse.data };
        });
        this.getChatterSingleChat = (ChatId) => __awaiter(this, void 0, void 0, function* () {
            const ChatsResponse = yield this._chatModel.checkIfExist({ _id: ChatId });
            if (!ChatsResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ _id: ChatsResponse.data.taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            const ChatterService = yield this._chatterServiceModel.checkIfExist({ _id: ChatsResponse.data.serviceId });
            if (!ChatterService.data)
                return { errors: [ERROR_GETTING_THIS_USER_SERVICE] };
            ChatsResponse.data.addTaskToModel = tasksResponse.data;
            ChatsResponse.data.addServiceToModel = ChatterService.data;
            return { Chat: ChatsResponse.data };
        });
        this.getModeratorChattersChat = (taskId, option) => __awaiter(this, void 0, void 0, function* () {
            if (option.status) {
                const ChatsResponse = yield this._chatModel.getAllTask({ taskId, taskStatus: option.status }, option);
                if (!ChatsResponse.data)
                    return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
                return { Chats: ChatsResponse.data };
            }
            const ChatsResponse = yield this._chatModel.getAllTask({ taskId }, option);
            if (!ChatsResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            return { Chats: ChatsResponse.data };
        });
        this.rejectChat = (userId, ChatId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ moderatorId: userId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            const ChatResponse = yield this._chatModel.checkIfExist({ _id: ChatId });
            if (!ChatResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            if (ChatResponse.data.taskId === tasksResponse.data.id)
                return { errors: [ERROR_GETTING_THIS_Chat] };
            if (ChatResponse.data.taskStatus === chat_cliamable_response_1.TaskStatusStatus.APPROVED)
                return { errors: [{ message: 'this Chat has been approved already' }] };
            if (ChatResponse.data.taskStatus === chat_cliamable_response_1.TaskStatusStatus.REJECTED)
                return { errors: [{ message: 'this Chat has been rejected already' }] };
            if (ChatResponse.data.taskId === tasksResponse.data.id)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            tasksResponse.data.modifyUserChattersNumber('remove');
            const updatedChatResponse = yield this._chatModel.updateTask(ChatId, { taskStatus: chat_cliamable_response_1.TaskStatusStatus.REJECTED });
            if (!updatedChatResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            const updatedTaskResponse = yield this._chatterTaskModel.updateTaskDetailToDB(ChatResponse.data.taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            updatedChatResponse.data.addTaskToModel = updatedTaskResponse.data;
            updatedChatResponse.data.assigneeId &&
                this._chatterServiceModel.updateCancelAnalytics(updatedChatResponse.data.assigneeId);
            return { Chat: updatedChatResponse.data };
        });
        this.approveChat = (userId, ChatId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ moderatorId: userId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_THIS_TASK] };
            const ChatResponse = yield this._chatModel.checkIfExist({ _id: ChatId });
            if (!ChatResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            if (ChatResponse.data.taskId === tasksResponse.data.id)
                return { errors: [ERROR_GETTING_THIS_Chat] };
            if (ChatResponse.data.taskStatus !== chat_cliamable_response_1.TaskStatusStatus.COMPLETED)
                return { errors: [{ message: 'this Chat has been completed' }] };
            const updatedChatResponse = yield this._chatModel.updateTask(ChatId, { taskStatus: chat_cliamable_response_1.TaskStatusStatus.APPROVED });
            if (!updatedChatResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            updatedChatResponse.data.addTaskToModel = tasksResponse.data;
            updatedChatResponse.data.assigneeId &&
                (yield Promise.all([
                    this._userModel.updateBalance(updatedChatResponse.data.assigneeId, chatters_dto_1.ChatterTaskDto.getPayoutPay()),
                    this._transactionModel.saveTransaction({
                        name: transaction_response_1.TransactionTypeEnum.CHATTER_SUBSCRIPTION,
                        userId: ChatResponse.data.assigneeId,
                        updatedAt: new Date(),
                        createdAt: new Date(),
                        transactionType: transaction_response_1.TransactionTypeEnum.CHATTER_SUBSCRIPTION,
                        transactionStatus: transaction_response_1.TransactionStatusEnum.COMPLETED,
                        amount: chatters_dto_1.ChatterTaskDto.getPayoutPay(),
                        isVerified: true,
                    })
                ]));
            return { Chat: updatedChatResponse.data };
        });
        this.approveTaskAsComplete = (userId, taskId) => __awaiter(this, void 0, void 0, function* () {
            const tasksResponse = yield this._chatterTaskModel.checkIfExist({ _id: taskId });
            if (!tasksResponse.data)
                return { errors: [ERROR_GETTING_THIS_TASK] };
            const updatedTaskResponse = yield this._chatterTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
            if (!updatedTaskResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            yield this._userModel.updateCompletedAnalytics(tasksResponse.data.userId, enums_1.ServiceAccountTypeEnum.chatter);
            const ChatsResponse = yield this._chatModel.getAllTasks([{ taskId, taskStatus: chat_cliamable_response_1.TaskStatusStatus.STARTED }]);
            if (!ChatsResponse.data)
                return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
            Promise.all(ChatsResponse.data.map((Chat) => {
                if (!Chat.assigneeId)
                    return;
                this._userModel.updateBalance(Chat.assigneeId, chatters_dto_1.ChatterTaskDto.getPayoutPay());
                this._transactionModel.saveTransaction({
                    name: transaction_response_1.TransactionTypeEnum.CHATTER_SUBSCRIPTION,
                    userId: Chat.assigneeId,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    transactionType: transaction_response_1.TransactionTypeEnum.CHATTER_SUBSCRIPTION,
                    transactionStatus: transaction_response_1.TransactionStatusEnum.COMPLETED,
                    amount: (chatters_dto_1.ChatterTaskDto.getPayoutPay()),
                    isVerified: true,
                });
            }));
            this._moderatorServiceModel.updateCompletedAnalytics(userId);
            const user = yield this._userModel.updateCompletedAnalytics(userId, enums_1.ServiceAccountTypeEnum.chatter);
            if (!user.data)
                return { errors: [ERROR_GETTING_THIS_TASK] };
            user.data.updateUserWithdrawableBalance({
                amount: user_dto_1.AmountEnum.moderatorChatterPay,
                type: 'paid'
            });
            const updatedUser = yield this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
            if (!updatedUser.data)
                return { errors: [ERROR_GETTING_THIS_TASK] };
            yield this._chatModel.deleteAllTask({ taskId });
            return { task: updatedTaskResponse.data };
        });
        this._chatModel = chatModel;
        this._chatterTaskModel = chatterTaskModel;
        this._moderatorServiceModel = moderatorServiceModel;
        this._chatterServiceModel = chatterServiceModel;
        this._userModel = userModel;
        this._transactionModel = transactionModel;
    }
}
exports.default = ModeratorUserTaskService;
