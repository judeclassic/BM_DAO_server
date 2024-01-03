"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleRaiderTaskDto = exports.RaiderTaskDto = void 0;
const raid_response_1 = require("../../interfaces/response/services/raid.response");
const raider_task_response_1 = require("../../interfaces/response/task/raider_task.response");
const user_dto_1 = require("../user.dto");
class RaiderTaskDto {
    constructor(task) {
        var _a;
        this.getAssignedTask = (assigneeId) => {
            var _a;
            return {
                assignerId: this.userId,
                assigneeId: assigneeId,
                taskId: this._id,
                timeLine: Date.parse((_a = this.endedAt) === null || _a === void 0 ? void 0 : _a.toDateString()),
                taskStatus: raid_response_1.TaskStatusStatus.STARTED,
            };
        };
        this.modifyUserRaidsNumber = (type, userAmount) => {
            if (type === 'add') {
                this.availableRaids = this.availableRaids - (userAmount !== null && userAmount !== void 0 ? userAmount : 1);
                return;
            }
            if (type === 'remove') {
                this.availableRaids = this.availableRaids + (userAmount !== null && userAmount !== void 0 ? userAmount : 1);
                return;
            }
            if (type === 'complete') {
                this.completedRaids = this.completedRaids + (userAmount !== null && userAmount !== void 0 ? userAmount : 1);
            }
        };
        this._id = task._id;
        this.raids = [];
        this.userId = task.userId;
        this.raidInformation = task.raidInformation;
        this.availableRaids = task.availableRaids;
        this.totalRaids = task.totalRaids;
        this.completedRaids = task.completedRaids;
        this.approvedRaids = task.approvedRaids;
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
            id: this._id,
            userId: this.userId,
            raids: this.raids,
            raidInformation: this.raidInformation,
            availableRaids: this.availableRaids,
            totalRaids: this.totalRaids,
            completedRaids: this.completedRaids,
            approvedRaids: this.approvedRaids,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            isVerified: this.isVerified,
        };
    }
    get getDBModel() {
        var _a;
        return {
            userId: this.userId,
            raids: this.raids,
            raidInformation: this.raidInformation,
            availableRaids: this.availableRaids,
            totalRaids: this.totalRaids,
            completedRaids: this.completedRaids,
            approvedRaids: this.approvedRaids,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            isVerified: this.isVerified,
            startTimeLine: this.startTimeLine,
            endTimeLine: this.endTimeLine,
            level: this.level,
            moderator: this.moderator,
            moderatorId: (_a = this.moderatorId) !== null && _a !== void 0 ? _a : 'nanananaan',
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
        return this.availableRaids !== 0;
    }
    static getPricingByAction(action) {
        if (action === raider_task_response_1.RaidActionEnum.commentOnPost) {
            return user_dto_1.AmountEnum.raidClientCommentCharge;
        }
        if (action === raider_task_response_1.RaidActionEnum.createATweet) {
            return user_dto_1.AmountEnum.raidClientTweetCharge;
        }
        if (action === raider_task_response_1.RaidActionEnum.followAccount) {
            return user_dto_1.AmountEnum.raidClientFollowCharge;
        }
        if (action === raider_task_response_1.RaidActionEnum.likePost) {
            return user_dto_1.AmountEnum.raidClientLikeCharge;
        }
        if (action === raider_task_response_1.RaidActionEnum.raid) {
            return user_dto_1.AmountEnum.raidClientRaidCharge;
        }
        return user_dto_1.AmountEnum.raidClientRetweetCharge;
    }
    static getPayoutByAction(action) {
        if (action === raider_task_response_1.RaidActionEnum.commentOnPost) {
            return user_dto_1.AmountEnum.raidRaiderCommentpay;
        }
        if (action === raider_task_response_1.RaidActionEnum.createATweet) {
            return user_dto_1.AmountEnum.raidRaiderTweetPay;
        }
        if (action === raider_task_response_1.RaidActionEnum.followAccount) {
            return user_dto_1.AmountEnum.raidRaiderFollowPay;
        }
        if (action === raider_task_response_1.RaidActionEnum.likePost) {
            return user_dto_1.AmountEnum.raidRaiderLikePay;
        }
        if (action === raider_task_response_1.RaidActionEnum.raid) {
            return user_dto_1.AmountEnum.raidRaiderRaidPay;
        }
        return user_dto_1.AmountEnum.raidRaiderRetweetpay;
    }
}
exports.RaiderTaskDto = RaiderTaskDto;
class MultipleRaiderTaskDto {
    constructor(multipleTask) {
        this.tasks = multipleTask.tasks.map((task) => new RaiderTaskDto(task));
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
exports.MultipleRaiderTaskDto = MultipleRaiderTaskDto;
