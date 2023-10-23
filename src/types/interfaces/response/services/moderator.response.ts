import { ServiceAccountTypeEnum } from "./enums";
import { IAnalytic } from "./raider.response";

export interface IModeratorUserService {
    _id?: string;
    name: string;
    accountType: ServiceAccountTypeEnum;
    subscriptionDate: number;
    userId: string;
    updatedAt?: Date;
    createdAt?: Date;
    isVerified?: boolean;
    work_timeout: number;
    analytics: IAnalytic
}
export interface IMultipleModeratorUserService {
    moderatorServices: IModeratorUserService[],
    totalModeratorServices: number,
    hasNextPage: boolean
}