import { ServiceAccountTypeEnum } from "../services/enums";

export interface IChatTaskInformation {
    serviceType: ServiceAccountTypeEnum,
    postLink: string,
    compaignCaption: string,
    chatterPerSession: number,
    hoursPerDay: number,
    startDate: Date,
    days: number
}

export enum TaskPriorityEnum {
    high = 'high',
    low = 'low',
}

export interface IChatterModerator {
    userId: string;
    serviceId: string;
    name: string;
}
export interface IChatterTask {
    _id?: string;
    level: TaskPriorityEnum;
    userId: string;
    chatInformation: IChatTaskInformation;
    startedAt?: Date;
    endedAt?: Date;
    updatedAt?: Date;
    createdAt?: Date;
    isVerified?: boolean;
    startTimeLine: number;
    endTimeLine: number
    isModerated: boolean;
    moderatorId?: string;
    moderator?: IChatterModerator

    approvedTask: number;
    availableTask: number;
    totalTasks: number;
    completedTasks: number;
}

export interface IMultipleChatterTask {
    tasks: IChatterTask[];
    totalTasks: number,
    hasNextPage: boolean
}