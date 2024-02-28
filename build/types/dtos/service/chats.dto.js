"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleChatTaskDto = exports.ChatTaskDto = void 0;
const chatters_dto_1 = require("../task/chatters.dto");
const chatters_dto_2 = __importDefault(require("./chatters.dto"));
class ChatTaskDto {
    constructor(raid) {
        this.id = raid._id;
        this.assignerId = raid.assignerId;
        this.assigneeId = raid.assigneeId;
        this.taskId = raid.taskId;
        this.serviceId = raid.serviceId;
        this.service = raid.service ? new chatters_dto_2.default(raid.service) : undefined;
        this.taskStatus = raid.taskStatus;
        this.task = raid.task && new chatters_dto_1.ChatterTaskDto(raid.task);
        this.startTime = raid.startTime;
        this.endTime = raid.endTime;
        this.timeLine = raid.timeLine;
        this.proofs = raid.proofs;
    }
    get getDBModel() {
        return {
            assignerId: this.assignerId,
            assigneeId: this.assigneeId,
            taskId: this.taskId,
            serviceId: this.serviceId,
            taskStatus: this.taskStatus,
            startTime: this.startTime,
            endTime: this.endTime,
            timeLine: this.timeLine,
            proofs: this.proofs
        };
    }
    get getResponse() {
        var _a, _b;
        const currentTime = Date.parse((new Date()).toISOString());
        const timeLine = currentTime < (this.timeLine + (1000 * 60 * 60 * 24)) ? 'ACTIVE' : 'EXPIRED';
        return {
            id: this.id,
            assignerId: this.assignerId,
            assigneeId: this.assigneeId,
            taskId: this.taskId,
            task: (_a = this.task) === null || _a === void 0 ? void 0 : _a.getResponse,
            serviceId: this.serviceId,
            service: (_b = this.service) === null || _b === void 0 ? void 0 : _b.getResponse,
            taskStatus: this.taskStatus,
            startTime: new Date(this.startTime),
            endTime: new Date(this.endTime),
            timeLine: timeLine,
            proofs: this.proofs
        };
    }
    set addTaskToModel(task) {
        this.task = task;
    }
    set addServiceToModel(service) {
        this.service = service;
    }
}
exports.ChatTaskDto = ChatTaskDto;
class MultipleChatTaskDto {
    constructor(chats) {
        this.chats = chats.chats.map((chat) => new ChatTaskDto(chat));
        this.totalChats = chats.totalChats;
        this.hasNextPage = chats.hasNextPage;
    }
    get getDBModel() {
        return {
            chats: this.chats.map((chat) => chat.getDBModel),
            totalChats: this.totalChats,
            hasNextPage: this.hasNextPage
        };
    }
    get getResponse() {
        return {
            chats: this.chats.map((chat) => chat.getResponse),
            totalChats: this.totalChats,
            hasNextPage: this.hasNextPage
        };
    }
}
exports.MultipleChatTaskDto = MultipleChatTaskDto;
