import { ServiceAccountTypeEnum } from "../../response/services/enums";

export type ICreateChatterGigRequest = {
    serviceType: ServiceAccountTypeEnum; 
    postLink: string;
    compaignCaption: string;
    chatterPerSession: number;
    hoursPerDay: number;
    startDate: Date;
    days: number;
}