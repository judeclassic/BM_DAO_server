export enum TaskStatusStatus {
  STARTED = "STARTED",
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum RaidType {
    like = 'likes',
    follow = 'follow',
    retweet = 'retweet',
    comment = 'comment'
}

export interface IRaid {
    _id?: string;
    assignerId: string;
    assigneeId: string;
    taskId: string;
    timeLine: number;
    taskStatus: TaskStatusStatus;
    proofs?: string[];
}

export interface IMultipleRaids {
    raids: IRaid[];
    totalRaids: number;
    hasNextPage: boolean;
}