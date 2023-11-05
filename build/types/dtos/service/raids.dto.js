"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleRaidDto = exports.RaidDto = void 0;
class RaidDto {
    constructor(raid) {
        this._id = raid._id;
        this.assignerId = raid.assignerId;
        this.assigneeId = raid.assigneeId;
        this.taskId = raid.taskId;
        this.taskStatus = raid.taskStatus;
        this.timeLine = raid.timeLine;
        this.proofs = raid.proofs;
    }
    get getDBModel() {
        return {
            _id: this._id,
            assignerId: this.assignerId,
            assigneeId: this.assigneeId,
            taskId: this.taskId,
            taskStatus: this.taskStatus,
            timeLine: this.timeLine,
            imageProve: this.proofs,
        };
    }
    get getResponse() {
        var _a;
        const currentTime = Date.parse((new Date()).toISOString()); // + (1000 * 60 * 60 * 24)
        const timeLine = currentTime < (this.timeLine + (1000 * 60 * 60 * 24)) ? 'ACTIVE' : 'EXPIRED';
        return {
            id: this._id,
            assignerId: this.assignerId,
            assigneeId: this.assigneeId,
            taskId: this.taskId,
            taskStatus: this.taskStatus,
            timeLine: timeLine,
            proofs: this.proofs,
            task: (_a = this.task) === null || _a === void 0 ? void 0 : _a.getResponse
        };
    }
    set addTaskToModel(task) {
        this.task = task;
    }
}
exports.RaidDto = RaidDto;
class MultipleRaidDto {
    constructor(raids) {
        this.raids = raids.raids.map((raid) => new RaidDto(raid));
        this.totalRaids = raids.totalRaids;
        this.hasNextPage = raids.hasNextPage;
    }
    get getDBModel() {
        return {
            raids: this.raids.map((raid) => raid.getDBModel),
            totalRaids: this.totalRaids,
            hasNextPage: this.hasNextPage
        };
    }
    get getResponse() {
        return {
            raids: this.raids.map((raid) => raid.getResponse),
            totalRaids: this.totalRaids,
            hasNextPage: this.hasNextPage
        };
    }
}
exports.MultipleRaidDto = MultipleRaidDto;
