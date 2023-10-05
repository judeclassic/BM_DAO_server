import { ServiceAccountTypeEnum } from "./enums";

export interface IRaiderUserService {
    _id?: string;
    accountType: ServiceAccountTypeEnum;
    subscriptionDate: number;
    userId: string;
    updatedAt?: Date;
    createdAt?: Date;
    isVerified?: boolean;
    work_timeout: number;
}

export interface IMultipleRaiderUserService {
    userServices: IRaiderUserService[],
    totalUserServices: number,
    hasNextPage: boolean
}