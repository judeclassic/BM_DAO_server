import { ServiceAccountTypeEnum } from "./enums";

export interface IAnalytic {
    availableTask: number;
    pendingTask: number;
    completedTask: number;
}

export interface IRaiderUserService {
    _id?: string;
    accountType: ServiceAccountTypeEnum;
    subscriptionDate: number;
    userId: string;
    updatedAt?: Date;
    createdAt?: Date;
    isVerified?: boolean;
    work_timeout: number;
    analytics: IAnalytic
}

export interface IMultipleRaiderUserService {
    userServices: IRaiderUserService[],
    totalUserServices: number,
    hasNextPage: boolean
}