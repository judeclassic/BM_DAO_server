import { ServiceAccountTypeEnum } from "./enums";

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
}
export interface IMultipleModeratorUserService {
    moderatorServices: IModeratorUserService[],
    totalModeratorServices: number,
    hasNextPage: boolean
}