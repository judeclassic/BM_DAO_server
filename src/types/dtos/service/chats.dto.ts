import { IChatTask, IMultipleChatTask, TaskStatusStatus } from "../../interfaces/response/services/chatter/chat_cliamable.response";
import { ISubSciptionStatus } from "../../interfaces/response/services/enums";
import { ChatterTaskDto, IChatterTaskResponse } from "../task/chatters.dto";
import ChatterUserServiceDto, { IChatterUserServiceResponse } from "./chatters.dto";

export interface IChatResponse {
  id?: string;
  assignerId: string;
  assigneeId: string;
  taskId: string;
  timeLine: ISubSciptionStatus;
  taskStatus: TaskStatusStatus;
  imageProve?: string[]; 
  task?: IChatterTaskResponse
  service?: IChatterUserServiceResponse;

  startTime: Date;
  endTime: Date;
}

export interface IMultipleChatResponse {
  chats: IChatResponse[];
  totalChats: number;
  hasNextPage: boolean;
}

export class ChatTaskDto implements IChatTask {
  id: string | undefined;
  assignerId: string;
  assigneeId?: string;
  taskId: string;
  serviceId?: string;
  service?: ChatterUserServiceDto;
  task?: ChatterTaskDto;
  startTime: number;
  endTime: number;
  timeLine: number;
  taskStatus: TaskStatusStatus;
  proofs?: string[];
  

  constructor (raid: IChatTask) {
    this.id = raid._id;
    this.assignerId = raid.assignerId;
    this.assigneeId = raid.assigneeId;
    this.taskId = raid.taskId;
    this.serviceId = raid.serviceId;
    this.service = raid.service ? new ChatterUserServiceDto(raid.service) : undefined;
    this.taskStatus = raid.taskStatus;
    this.task = raid.task && new ChatterTaskDto(raid.task);
    this.startTime = raid.startTime;
    this.endTime = raid.endTime;
    this.timeLine = raid.timeLine;
    this.proofs = raid.proofs;
  }

  get getDBModel() {
    return {
      assignerId: this.assignerId,
      assigneeId: this.assigneeId,
      taskId: this.taskId,
      serviceId: this.serviceId,
      taskStatus: this.taskStatus,
      startTime: this.startTime,
      endTime: this.endTime,
      timeLine: this.timeLine,
      proofs: this.proofs
    } as IChatTask
  }

  get getResponse() {
    const currentTime = Date.parse((new Date()).toISOString())
    const timeLine = currentTime < (this.timeLine + (1000 * 60 * 60 * 24)) ? 'ACTIVE' : 'EXPIRED'

    return {
      id: this.id,
      assignerId: this.assignerId,
      assigneeId: this.assigneeId,
      taskId: this.taskId,
      task: this.task?.getResponse,
      serviceId: this.serviceId,
      service: this.service?.getResponse,
      taskStatus: this.taskStatus,
      startTime: new Date(this.startTime),
      endTime: new Date(this.endTime),
      timeLine: timeLine,
      proofs: this.proofs
    } as IChatResponse
  }

  set addTaskToModel(task: ChatterTaskDto) {
    this.task = task;
  }

  set addServiceToModel(service: ChatterUserServiceDto) {
    this.service = service;
  }
}

export class MultipleChatTaskDto implements IMultipleChatTask {
  chats: ChatTaskDto[];
  totalChats: number;
  hasNextPage: boolean;

  constructor (chats: IMultipleChatTask) {
    this.chats = chats.chats.map((chat) => new ChatTaskDto(chat));
    this.totalChats = chats.totalChats;
    this.hasNextPage = chats.hasNextPage;
  }

  get getDBModel() {
    return {
      chats: this.chats.map((chat) => chat.getDBModel ),
      totalChats: this.totalChats,
      hasNextPage: this.hasNextPage
    } as IMultipleChatTask;
  }

  get getResponse() {
    return {
      chats: this.chats.map((chat) => chat.getResponse ),
      totalChats: this.totalChats,
      hasNextPage: this.hasNextPage
    } as IMultipleChatResponse;
  }
}
