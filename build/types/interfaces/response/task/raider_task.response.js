"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriorityEnum = exports.RaidActionEnum = void 0;
var RaidActionEnum;
(function (RaidActionEnum) {
    RaidActionEnum["followAccount"] = "Follow Account";
    RaidActionEnum["likePost"] = "Like Post";
    RaidActionEnum["retweetPost"] = "Retweet Post";
    RaidActionEnum["commentOnPost"] = "Comment on Post";
    RaidActionEnum["createATweet"] = "Create a Tweet";
})(RaidActionEnum = exports.RaidActionEnum || (exports.RaidActionEnum = {}));
var TaskPriorityEnum;
(function (TaskPriorityEnum) {
    TaskPriorityEnum["high"] = "high";
    TaskPriorityEnum["low"] = "low";
})(TaskPriorityEnum = exports.TaskPriorityEnum || (exports.TaskPriorityEnum = {}));
