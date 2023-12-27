"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorTaskDto = void 0;
const raider_task_response_1 = require("../../interfaces/response/task/raider_task.response");
const user_dto_1 = require("../user.dto");
class ModeratorTaskDto {
    static getRaiderPayoutByAction(action) {
        if (action === raider_task_response_1.RaidActionEnum.commentOnPost) {
            return user_dto_1.AmountEnum.raidModeratorCommentpay;
        }
        if (action === raider_task_response_1.RaidActionEnum.createATweet) {
            return user_dto_1.AmountEnum.raidModeratorTweetPay;
        }
        if (action === raider_task_response_1.RaidActionEnum.followAccount) {
            return user_dto_1.AmountEnum.raidModeratorFollowPay;
        }
        if (action === raider_task_response_1.RaidActionEnum.likePost) {
            return user_dto_1.AmountEnum.raidModeratorLikePay;
        }
        if (action === raider_task_response_1.RaidActionEnum.raid) {
            return user_dto_1.AmountEnum.raidModeratorRaidPay;
        }
        return user_dto_1.AmountEnum.raidModeratorRetweetpay;
    }
}
exports.ModeratorTaskDto = ModeratorTaskDto;
