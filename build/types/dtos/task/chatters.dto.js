"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleChatterTaskDto = exports.ChatterTaskDto = void 0;
const chat_cliamable_response_1 = require("../../interfaces/response/services/chatter/chat_cliamable.response");
const user_dto_1 = require("../user.dto");
class ChatterTaskDto {
    constructor(task) {
        var _a;
        this.getAssignedTask = (assigneeId, assigneeServiceId) => {
            var _a;
            return {
                assignerId: this.userId,
                assigneeId: assigneeId,
                serviceId: assigneeServiceId,
                taskId: this.id,
                timeLine: Date.parse((_a = this.endedAt) === null || _a === void 0 ? void 0 : _a.toDateString()),
                taskStatus: chat_cliamable_response_1.TaskStatusStatus.STARTED,
            };
        };
        this.modifyUserChattersNumber = (type, userAmount) => {
            if (type === 'add') {
                this.availableTask = this.availableTask - (userAmount !== null && userAmount !== void 0 ? userAmount : 1);
                return;
            }
            if (type === 'remove') {
                this.availableTask = this.availableTask + (userAmount !== null && userAmount !== void 0 ? userAmount : 1);
                return;
            }
            if (type === 'complete') {
                this.completedTasks = this.completedTasks + (userAmount !== null && userAmount !== void 0 ? userAmount : 1);
            }
        };
        this.id = task._id;
        this.claimableTask = [];
        this.userId = task.userId;
        this.chatInformation = task.chatInformation;
        this.availableTask = task.availableTask;
        this.approvedTask = task.approvedTask;
        this.totalTasks = task.totalTasks;
        this.completedTasks = task.completedTasks;
        this.startedAt = task.startedAt;
        this.endedAt = task.endedAt;
        this.createdAt = task.createdAt;
        this.updatedAt = task.updatedAt;
        this.isVerified = task.isVerified;
        this.level = task.level;
        this.startTimeLine = task.startTimeLine;
        this.endTimeLine = task.endTimeLine;
        this.isModerated = (_a = task.isModerated) !== null && _a !== void 0 ? _a : false;
        this.moderatorId = task.moderatorId;
        this.moderator = task.moderator;
    }
    get getResponse() {
        return {
            id: this.id,
            userId: this.userId,
            claimableTask: this.claimableTask.map(task => task.getResponse),
            chatInformation: this.chatInformation,
            availableTask: this.availableTask,
            totalTasks: this.totalTasks,
            completedTasks: this.completedTasks,
            approvedTask: this.approvedTask,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            isVerified: this.isVerified,
            level: this.level,
            startTimeLine: this.startTimeLine,
            endTimeLine: this.endTimeLine,
            isModerated: this.isModerated
        };
    }
    get getDBModel() {
        return {
            userId: this.userId,
            chatInformation: this.chatInformation,
            availableTask: this.availableTask,
            totalTasks: this.totalTasks,
            completedTasks: this.completedTasks,
            approvedTask: this.approvedTask,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            isVerified: this.isVerified,
            startTimeLine: this.startTimeLine,
            endTimeLine: this.endTimeLine,
            level: this.level,
            moderator: this.moderator,
            moderatorId: this.moderatorId,
            isModerated: this.isModerated
        };
    }
    set addModerator(moderatorServiceDto) {
        this.moderatorId = moderatorServiceDto.userId;
        this.isModerated = true;
        this.moderator = {
            userId: moderatorServiceDto.userId,
            serviceId: moderatorServiceDto._id,
            name: moderatorServiceDto.name
        };
    }
    get isTaskAvailable() {
        return this.availableTask > 0;
    }
    static getPayoutCharge() {
        return user_dto_1.AmountEnum.chatterCharge;
    }
    static getPayoutPay() {
        return user_dto_1.AmountEnum.chatterPay;
    }
}
exports.ChatterTaskDto = ChatterTaskDto;
class MultipleChatterTaskDto {
    constructor(multipleTask) {
        this.tasks = multipleTask.tasks.map((task) => new ChatterTaskDto(task));
        this.totalTasks = multipleTask.totalTasks;
        this.hasNextPage = multipleTask.hasNextPage;
    }
    get getResponse() {
        return {
            tasks: this.tasks.map((task) => task.getResponse),
            totalTasks: this.totalTasks,
            hasNextPage: this.hasNextPage
        };
    }
}
exports.MultipleChatterTaskDto = MultipleChatterTaskDto;
