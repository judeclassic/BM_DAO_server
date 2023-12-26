import { RaidActionEnum } from "../../interfaces/response/task/raider_task.response";
import { AmountEnum } from "../user.dto";


export class ModeratorTaskDto {

  static getRaiderPayoutByAction(action: RaidActionEnum) {
    if (action === RaidActionEnum.commentOnPost) {
      return AmountEnum.raidModeratorCommentpay
    }
    if (action === RaidActionEnum.createATweet) {
      return AmountEnum.raidModeratorTweetPay
    }
    if (action === RaidActionEnum.followAccount) {
      return AmountEnum.raidModeratorFollowPay
    }
    if (action === RaidActionEnum.likePost) {
      return AmountEnum.raidModeratorLikePay
    }
    if (action === RaidActionEnum.raid) {
      return AmountEnum.raidModeratorRaidPay
    }
    return AmountEnum.raidModeratorRetweetpay;
  }
}