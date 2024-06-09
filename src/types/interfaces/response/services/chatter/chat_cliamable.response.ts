import { IChatterTask } from "../../task/chatter_task.response";
import { IChatterUserService } from "./chatter.response";

export enum TaskStatusStatus {
  PENDING = "PENDING",
  STARTED = "STARTED",
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface IChatTask {
    _id?: string;
    assignerId: string;
    assigneeId?: string;
    serviceId?: string;
    service?: IChatterUserService;
    taskId: any;
    task?: IChatterTask;
    startTime: number;
    endTime: number;
    timeLine: number;
    taskStatus: TaskStatusStatus;
    proofs?: string[];
    moderatorId?: string;
    moderatorExpiredTime?: number;
}

export interface IMultipleChatTask {
    chats: IChatTask[];
    totalChats: number;
    hasNextPage: boolean;
}