
import { IChatTask, TaskStatusStatus } from "../../interfaces/response/services/chatter/chat_cliamable.response";
import { IChatTaskInformation, IChatterModerator, IChatterTask, IMultipleChatterTask, TaskPriorityEnum } from "../../interfaces/response/task/chatter_task.response";
import { ChatTaskDto, IChatResponse } from "../service/chats.dto";
import ModeratorUserServiceDto from "../service/moderators.dto";
import { AmountEnum } from "../user.dto";

export interface IChatterTaskResponse {
  id?: string;
  claimableTask: IChatResponse[];
  userId: string;
  chatInformation: IChatTaskInformation;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  createdAt?: Date;
  isVerified?: boolean;
  level: TaskPriorityEnum;
  startTimeLine: number;
  endTimeLine: number;

  isModerated: boolean;
  moderatorId?: string;
  moderator?: IChatterModerator;

  availableTask: number;
  approvedTask: number;
  totalTasks: number;
  completedTasks: number;

}

export interface IMultipleChatterTaskResponse {
  tasks: IChatterTaskResponse[];
  totalTasks: number,
  hasNextPage: boolean
}


export class ChatterTaskDto implements IChatterTask {
  id?: string;
  claimableTask: ChatTaskDto[];
  userId: string;
  chatInformation: IChatTaskInformation;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  createdAt?: Date;
  isVerified?: boolean;
  level: TaskPriorityEnum;
  startTimeLine: number;
  endTimeLine: number;

  isModerated: boolean;
  moderatorId?: string;
  moderator?: IChatterModerator;

  availableTask: number;
  approvedTask: number;
  totalTasks: number;
  completedTasks: number;

  constructor(task: IChatterTask) {
    this.id = task._id;
    this.claimableTask = [];
    this.userId = task.userId;
    this.chatInformation = task.chatInformation;
    this.availableTask = task.availableTask;
    this.approvedTask = task.approvedTask;
    this.totalTasks = task.totalTasks;
    this.completedTasks = task.completedTasks;
    this.startedAt = task.startedAt;
    this.endedAt = task.endedAt;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
    this.isVerified = task.isVerified;
    this.level = task.level;
    this.startTimeLine = task.startTimeLine;
    this.endTimeLine = task.endTimeLine;

    this.isModerated = task.isModerated ?? false;
    this.moderatorId = task.moderatorId;
    this.moderator = task.moderator;
  }

  get getResponse(): IChatterTaskResponse {
    return {
      id: this.id,
      userId: this.userId,
      claimableTask: this.claimableTask.map(task => task.getResponse),
      chatInformation: this.chatInformation,
      availableTask: this.availableTask,
      totalTasks: this.totalTasks,
      completedTasks: this.completedTasks,
      approvedTask: this.approvedTask,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      isVerified: this.isVerified,
      level: this.level,
      startTimeLine: this.startTimeLine,
      endTimeLine: this.endTimeLine,
      isModerated: this.isModerated
    };
  }

  get getDBModel(): IChatterTask {
    return {
      userId: this.userId,
      chatInformation: this.chatInformation,
      availableTask: this.availableTask,
      totalTasks: this.totalTasks,
      completedTasks: this.completedTasks,
      approvedTask: this.approvedTask,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      isVerified: this.isVerified,
      startTimeLine: this.startTimeLine,
      endTimeLine: this.endTimeLine,
      level: this.level,
      moderator: this.moderator,
      moderatorId: this.moderatorId,
      isModerated: this.isModerated
    };
  }

  getAssignedTask = (assigneeId: string, assigneeServiceId: string) => {
    return {
      assignerId: this.userId,
      assigneeId: assigneeId,
      serviceId: assigneeServiceId,
      taskId: this.id,
      timeLine: Date.parse(this.endedAt?.toDateString()!),
      taskStatus: TaskStatusStatus.STARTED,
    } as IChatTask;
  }

  set addModerator(moderatorServiceDto: ModeratorUserServiceDto) {
    this.moderatorId = moderatorServiceDto.userId;
    this.isModerated = true;
    this.moderator = { 
      userId: moderatorServiceDto.userId,
      serviceId: moderatorServiceDto._id!,
      name: moderatorServiceDto.name
    }
  }

  modifyUserChattersNumber = (type: 'add' | 'remove' | 'complete', userAmount?: number) => {
    if (type === 'add') {
      this.availableTask = this.availableTask - (userAmount ?? 1);
      return;
    }
    if (type === 'remove') {
      this.availableTask = this.availableTask + (userAmount ?? 1);
      return;
    }
    if (type === 'complete') {
      this.completedTasks = this.completedTasks + (userAmount ?? 1);
    }
  }

  get isTaskAvailable() {
    return this.availableTask > 0;
  }

  static getPayoutCharge() {
    return AmountEnum.chatterCharge;
  }

  static getPayoutPay() {
    return AmountEnum.chatterPay;
  }
}

export class MultipleChatterTaskDto implements IMultipleChatterTask {
  tasks: ChatterTaskDto[];
  totalTasks: number;
  hasNextPage: boolean;

  constructor (multipleTask: IMultipleChatterTask) {
    this.tasks = multipleTask.tasks.map((task) => new ChatterTaskDto(task));
    this.totalTasks = multipleTask.totalTasks;
    this.hasNextPage = multipleTask.hasNextPage;
  }

  get getResponse() {
    return {
      tasks: this.tasks.map((task) => task.getResponse ),
      totalTasks: this.totalTasks,
      hasNextPage: this.hasNextPage
    } as IMultipleChatterTaskResponse;
  }
}