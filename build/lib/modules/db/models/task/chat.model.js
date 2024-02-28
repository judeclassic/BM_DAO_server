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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const logger_1 = require("../../../logger");
const chat_cliamable_response_1 = require("../../../../../types/interfaces/response/services/chatter/chat_cliamable.response");
const chats_dto_1 = require("../../../../../types/dtos/service/chats.dto");
const ChatterTaskSchema = new mongoose_1.Schema({
    assignerId: String,
    assigneeId: String,
    taskId: String,
    serviceId: String,
    // task: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'ChatterTask',
    // },
    startTime: Number,
    endTime: Number,
    timeLine: Number,
    taskStatus: {
        type: String,
        enum: Object.values(chat_cliamable_response_1.TaskStatusStatus),
    },
    proofs: [String],
});
ChatterTaskSchema.plugin(mongoose_paginate_v2_1.default);
exports.Task = (0, mongoose_1.model)("ChatTask", ChatterTaskSchema);
class ChatTaskModel {
    constructor() {
        this.deleteAllTask = ({ taskId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.deleteMany({ taskId });
                if (data) {
                    return { status: true };
                }
                else {
                    return { status: false, error: "Couldn't create ChatTask" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.createTask = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.create(details);
                if (data) {
                    return { status: true, data: new chats_dto_1.ChatTaskDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't create ChatTask" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateTask = (id, details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.findByIdAndUpdate(id, details, { new: true });
                if (data) {
                    return { status: true, data: new chats_dto_1.ChatTaskDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't update ChatTask" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.checkIfExist = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.findOne(details);
                if (data) {
                    return { status: true, data: new chats_dto_1.ChatTaskDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't update ChatTask" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.getAllTask = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.paginate(details, Object.assign(Object.assign({}, option), { sort: { _id: -1 } }));
                if (data) {
                    return { status: true,
                        data: new chats_dto_1.MultipleChatTaskDto({
                            chats: data.docs,
                            totalChats: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        }) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getAllTasks = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.find({ $or: details });
                if (data) {
                    return { status: true, data: data.map((service) => new chats_dto_1.ChatTaskDto(service)) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getAllTasksInPages = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.paginate(details, Object.assign(Object.assign({}, option), { sort: { _id: -1 } }));
                if (data) {
                    return { status: true,
                        data: new chats_dto_1.MultipleChatTaskDto({
                            chats: data.docs,
                            totalChats: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        }) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getAllChatTaskByWorkStatus = (status, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = Date.parse((new Date()).toISOString());
                const data = status === 'free' ?
                    yield this.ChatTask.paginate({ work_timeout: { $lt: currentTime }, subscriptionDate: { $lt: currentTime } }, Object.assign(Object.assign({}, option), { sort: { _id: -1 } }))
                    :
                        yield this.ChatTask.paginate({ work_timeout: { $gt: currentTime }, subscriptionDate: { $lt: currentTime } }, Object.assign(Object.assign({}, option), { sort: { _id: -1 } }));
                if (data) {
                    return { status: true,
                        data: new chats_dto_1.MultipleChatTaskDto({
                            chats: data.docs,
                            totalChats: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        }) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.deleteTask = (requestId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ChatTask.findByIdAndRemove(requestId);
                if (data) {
                    return { status: true, data: new chats_dto_1.ChatTaskDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't create user" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.ChatTask = exports.Task;
    }
}
exports.default = ChatTaskModel;
