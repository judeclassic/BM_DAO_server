"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidType = exports.TaskStatusStatus = void 0;
var TaskStatusStatus;
(function (TaskStatusStatus) {
    TaskStatusStatus["STARTED"] = "STARTED";
    TaskStatusStatus["EXPIRED"] = "EXPIRED";
    TaskStatusStatus["COMPLETED"] = "COMPLETED";
})(TaskStatusStatus = exports.TaskStatusStatus || (exports.TaskStatusStatus = {}));
var RaidType;
(function (RaidType) {
    RaidType["like"] = "likes";
    RaidType["follow"] = "follow";
    RaidType["retweet"] = "retweet";
    RaidType["comment"] = "comment";
})(RaidType = exports.RaidType || (exports.RaidType = {}));
