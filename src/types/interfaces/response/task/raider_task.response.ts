
export enum RaidActionEnum {
    followAccount = 'Follow Account',
    likePost = 'Like Post',
    retweetPost = 'Retweet Post',
    commentOnPost = 'Comment on Post',
    createATweet = 'Create a Tweet',
}



export interface IRaidTaskInformation {
    action: RaidActionEnum,
    raidLink: string;
    campaignCaption: string;
    amount: number;
}

export enum TaskPriorityEnum {
    high = 'high',
    low = 'low',
}

export interface IRaiderModerator {
    userId: string;
    serviceId: string;
    name: string;
}
export interface IRaiderTask {
    _id?: string;
    level: TaskPriorityEnum;
    userId: string;
    raidInformation: IRaidTaskInformation;
    availableRaids: number;
    totalRaids: number;
    completedRaids: number;
    approvedRaids: number;
    startedAt?: Date;
    endedAt?: Date;
    updatedAt?: Date;
    createdAt?: Date;
    isVerified?: boolean;
    startTimeLine: number;
    endTimeLine: number
    isModerated: boolean;
    moderatorId?: string;
    moderator?: IRaiderModerator
}

export interface IMultipleRaiderTask {
    tasks: IRaiderTask[];
    totalTasks: number,
    hasNextPage: boolean
}

