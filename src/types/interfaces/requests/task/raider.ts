import { ServiceAccountTypeEnum } from "../../response/services/enums";
import { RaidActionEnum } from "../../response/task/raider_task.response";

export type ICreateRaiderGigRequest = {
    serviceType: ServiceAccountTypeEnum; 
    raidLink: string;
    compaignCaption: string;
    raidersNumber: number;
    startDate: string;
    weeks: number;
    dailyPost: number;
}
export type ICreateRaiderTaskRequest = {
    taskType: ServiceAccountTypeEnum;
    action: RaidActionEnum;
    numbers: number;
    raidLink: string;
    mediaUrl: string;
    campaignCaption: string;
    startDate: string
}