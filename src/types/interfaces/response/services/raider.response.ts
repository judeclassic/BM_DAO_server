import { ServiceAccountTypeEnum } from "./enums";

export interface IAnalytic {
    availableTask: number;
    pendingTask: number;
    completedTask: number;
}

export interface ISocialHandle {
    twitter?: string;
    reddit?: string;
    tiktok?: string;
    instagram?: string;
    telegram?: string;
    thread?: string;
    discord?: string;
    youtube?: string;
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
    analytics: IAnalytic;
    handles: ISocialHandle;
}

export interface IMultipleRaiderUserService {
    userServices: IRaiderUserService[],
    totalUserServices: number,
    hasNextPage: boolean
}