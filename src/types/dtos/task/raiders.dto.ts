import { IRaid, TaskStatusStatus } from "../../interfaces/response/services/raid.response";
import { IRaiderTask, IMultipleRaiderTask, IRaidTaskInformation, TaskPriorityEnum, IRaiderModerator, RaidActionEnum } from "../../interfaces/response/task/raider_task.response";
import ModeratorUserServiceDto from "../service/moderators.dto";
import { AmountEnum } from "../user.dto";

export interface IRaiderTaskResponse {
  _id?: string;
  raids: IRaid[];
  userId: string;
  raidInformation: IRaidTaskInformation;
  availableRaids: number;
  totalRaids: number;
  completedRaids: number;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  createdAt?: Date;
  isVerified?: boolean;
}

export interface IMultipleRaiderTaskResponse {
  tasks: IRaiderTaskResponse[];
  totalTasks: number,
  hasNextPage: boolean
}


export class RaiderTaskDto implements IRaiderTask {
  _id?: string;
  raids: IRaid[];
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
  level: TaskPriorityEnum;
  startTimeLine: number;
  endTimeLine: number;

  isModerated: boolean;
  moderatorId?: string;
  moderator?: IRaiderModerator;

  constructor(task: IRaiderTask) {
    this._id = task._id;
    this.raids = [];
    this.userId = task.userId;
    this.raidInformation = task.raidInformation;
    this.availableRaids = task.availableRaids;
    this.totalRaids = task.totalRaids;
    this.completedRaids = task.completedRaids;
    this.approvedRaids = task.approvedRaids;
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

  get getResponse() {
    return {
      id: this._id,
      userId: this.userId,
      raids: this.raids,
      raidInformation: this.raidInformation,
      availableRaids: this.availableRaids,
      totalRaids: this.totalRaids,
      completedRaids: this.completedRaids,
      approvedRaids: this.approvedRaids,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      isVerified: this.isVerified,
    } as IRaiderTaskResponse;
  }

  get getDBModel() {
    return {
      userId: this.userId,
      raids: this.raids,
      raidInformation: this.raidInformation,
      availableRaids: this.availableRaids,
      totalRaids: this.totalRaids,
      completedRaids: this.completedRaids,
      approvedRaids: this.approvedRaids,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      isVerified: this.isVerified,
      startTimeLine: this.startTimeLine,
      endTimeLine: this.endTimeLine,
      level: this.level,
      moderator: this.moderator,
      moderatorId: this.moderatorId ?? 'nanananaan',
      isModerated: this.isModerated
    } as IRaiderTask;
  }

  getAssignedTask = (assigneeId: string) => {
    return {
      assignerId: this.userId,
      assigneeId: assigneeId,
      taskId: this._id,
      timeLine: Date.parse(this.endedAt?.toDateString()!),
      taskStatus: TaskStatusStatus.STARTED,
    } as IRaid;
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

  modifyUserRaidsNumber = (type: 'add' | 'remove' | 'complete', userAmount?: number) => {
    if (type === 'add') {
      this.availableRaids = this.availableRaids - (userAmount ?? 1);
      return;
    }
    if (type === 'remove') {
      this.availableRaids = this.availableRaids + (userAmount ?? 1);
      return;
    }
    if (type === 'complete') {
      this.completedRaids = this.completedRaids + (userAmount ?? 1);
    }
  }

  get isTaskAvailable() {
    return this.availableRaids !== 0;
  }

  static getPricingByAction(action: RaidActionEnum) {
    if (action === RaidActionEnum.commentOnPost) {
      return AmountEnum.raidClientCommentCharge
    }
    if (action === RaidActionEnum.createATweet) {
      return AmountEnum.raidClientTweetCharge
    }
    if (action === RaidActionEnum.followAccount) {
      return AmountEnum.raidClientFollowCharge
    }
    if (action === RaidActionEnum.likePost) {
      return AmountEnum.raidClientLikeCharge
    }
    if (action === RaidActionEnum.raid) {
      return AmountEnum.raidClientRaidCharge
    }
    return AmountEnum.raidClientRetweetCharge;
  }

  static getPayoutByAction(action: RaidActionEnum) {
    if (action === RaidActionEnum.commentOnPost) {
      return AmountEnum.raidRaiderCommentpay
    }
    if (action === RaidActionEnum.createATweet) {
      return AmountEnum.raidRaiderTweetPay
    }
    if (action === RaidActionEnum.followAccount) {
      return AmountEnum.raidRaiderFollowPay
    }
    if (action === RaidActionEnum.likePost) {
      return AmountEnum.raidRaiderLikePay
    }
    if (action === RaidActionEnum.raid) {
      return AmountEnum.raidRaiderRaidPay
    }
    return AmountEnum.raidRaiderRetweetpay;
  }
}

export class MultipleRaiderTaskDto implements IMultipleRaiderTask {
  tasks: RaiderTaskDto[];
  totalTasks: number;
  hasNextPage: boolean;

  constructor (multipleTask: IMultipleRaiderTask) {
    this.tasks = multipleTask.tasks.map((task) => new RaiderTaskDto(task));
    this.totalTasks = multipleTask.totalTasks;
    this.hasNextPage = multipleTask.hasNextPage;
  }

  get getResponse() {
    return {
      tasks: this.tasks.map((task) => task.getResponse ),
      totalTasks: this.totalTasks,
      hasNextPage: this.hasNextPage
    } as IMultipleRaiderTaskResponse;
  }
}