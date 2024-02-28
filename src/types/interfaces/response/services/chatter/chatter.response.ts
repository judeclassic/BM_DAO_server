import { ServiceAccountTypeEnum } from "../enums";

export interface IAnalytic {
    availableTask: number;
    pendingTask: number;
    completedTask: number;
}

export interface IChatterSocialHandle {
    twitter?: string;
    reddit?: string;
    tiktok?: string;
    instagram?: string;
    telegram?: string;
    thread?: string;
    discord?: string;
    youtube?: string;
}

export interface IChatterUserService {
    _id?: string;
    accountType: ServiceAccountTypeEnum;
    subscriptionDate: number;
    userId: string;
    updatedAt?: Date;
    createdAt?: Date;
    isVerified?: boolean;
    work_timeout: number;
    analytics: IAnalytic;
    handles: IChatterSocialHandle
}

export interface IMultipleChatterUserService {
    userServices: IChatterUserService[],
    totalUserServices: number,
    hasNextPage: boolean
}