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
const chatter_task_response_1 = require("../../../../../types/interfaces/response/task/chatter_task.response");
const chatters_dto_1 = require("../../../../../types/dtos/task/chatters.dto");
const enums_1 = require("../../../../../types/interfaces/response/services/enums");
const ChatTaskInformationSchema = new mongoose_1.Schema({
    serviceType: {
        type: String,
        enum: Object.values(enums_1.ServiceAccountTypeEnum),
    },
    postLink: String,
    compaignCaption: String,
    chatterPerSession: Number,
    hoursPerDay: Number,
    startDate: Date,
    days: Number
});
const ChatterTaskSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: [true, 'TaskId is required'],
    },
    availableTask: {
        type: Number,
    },
    totalTasks: {
        type: Number,
    },
    completedTasks: {
        type: Number,
    },
    approvedTask: {
        type: Number,
    },
    raidInformation: ChatTaskInformationSchema,
    startedAt: {
        type: Date,
        default: new Date()
    },
    endedAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    level: {
        type: String,
        enum: Object.values(chatter_task_response_1.TaskPriorityEnum)
    },
    startTimeLine: {
        type: Number,
    },
    endTimeLine: {
        type: Number,
    },
    isModerated: {
        type: Boolean,
        default: false
    },
    moderatorId: {
        type: String
    }
});
ChatterTaskSchema.plugin(mongoose_paginate_v2_1.default);
exports.Task = (0, mongoose_1.model)("ChatterTask", ChatterTaskSchema);
class ChatterTaskModel {
    constructor() {
        this.saveTaskToDB = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Task.create(details);
                if (data) {
                    return { status: true, data: new chatters_dto_1.ChatterTaskDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't create Task" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateTaskDetailToDB = (id, details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Task.findByIdAndUpdate(id, details, { new: true });
                console.log(data);
                if (data) {
                    return { status: true, data: new chatters_dto_1.ChatterTaskDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't update Task" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.checkIfExist = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Task.findOne(details);
                if (data) {
                    return { status: true, data: new chatters_dto_1.ChatterTaskDto(data) };
                }
                else {
                    return { status: false, error: `Can't find Details` };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.getAllTask = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Task.paginate(details, Object.assign(Object.assign({}, option), { sort: { _id: -1 } }));
                if (data) {
                    return { status: true,
                        data: new chatters_dto_1.MultipleChatterTaskDto({
                            tasks: data.docs,
                            totalTasks: data.totalDocs,
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
        this.getActiveTask = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const date = (new Date()).toISOString();
                const timeLine = Date.parse(date);
                const data = yield this.Task.paginate(Object.assign({ startTimeLine: { $lt: timeLine }, endTimeLine: { $gt: timeLine } }, details), Object.assign(Object.assign({}, option), { sort: { _id: -1 } }));
                if (data) {
                    return { status: true,
                        data: new chatters_dto_1.MultipleChatterTaskDto({
                            tasks: data.docs,
                            totalTasks: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        })
                    };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getFutureTask = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const date = (new Date()).toISOString();
                const timeLine = Date.parse(date);
                const data = yield this.Task.paginate(Object.assign({ endTimeLine: { $gt: timeLine } }, details), Object.assign(Object.assign({}, option), { sort: { _id: -1 } }));
                if (data) {
                    return { status: true,
                        data: new chatters_dto_1.MultipleChatterTaskDto({
                            tasks: data.docs,
                            totalTasks: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        })
                    };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.Task = exports.Task;
    }
}
exports.default = ChatterTaskModel;
