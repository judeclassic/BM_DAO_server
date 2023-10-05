import { ServiceAccountTypeEnum } from "../../response/services/enums";

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
    actions: [];
    users: number;
    raidLink: string;
    mediaUrl: string;
    campaignCaption: string;
    startDate: string
}