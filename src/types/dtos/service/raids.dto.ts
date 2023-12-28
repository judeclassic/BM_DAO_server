import { ISubSciptionStatus } from "../../interfaces/response/services/enums";
import { IMultipleRaids, IRaid, TaskStatusStatus } from "../../interfaces/response/services/raid.response";
import { IRaiderUserService } from "../../interfaces/response/services/raider.response";
import { IRaiderTaskResponse, RaiderTaskDto } from "../task/raiders.dto";
import RaiderUserServiceDto from "./raiders.dto";

export interface IRaidResponse {
  id?: string;
  assignerId: string;
  assigneeId: string;
  taskId: string;
  timeLine: ISubSciptionStatus;
  taskStatus: TaskStatusStatus;
  imageProve?: string[]; 
  task?: IRaiderTaskResponse
  service?: IRaiderUserService;
}

export interface IMultipleRaidResponse {
  raids: IRaidResponse[];
  totalRaids: number;
  hasNextPage: boolean;
}

export class RaidDto implements IRaid {
  _id?: string;
  assignerId: string;
  assigneeId: string;
  taskId: string;
  taskStatus: TaskStatusStatus;
  timeLine: number;
  proofs?: string[];
  task?: RaiderTaskDto
  serviceId: string;
  service?: RaiderUserServiceDto;

  constructor (raid: IRaid) {
    this._id = raid._id;
    this.assignerId = raid.assignerId;
    this.assigneeId = raid.assigneeId;
    this.taskId = raid.taskId;
    this.serviceId = raid.serviceId;
    this.taskStatus = raid.taskStatus;
    this.timeLine = raid.timeLine;
    this.proofs = raid.proofs;
  }

  get getDBModel() {
    return {
      _id: this._id,
      assignerId: this.assignerId,
      assigneeId: this.assigneeId,
      taskId: this.taskId,
      serviceId: this.serviceId,
      taskStatus: this.taskStatus,
      timeLine: this.timeLine,
      imageProve: this.proofs,
    } as IRaid
  }

  get getResponse() {
    const currentTime = Date.parse((new Date()).toISOString())// + (1000 * 60 * 60 * 24)
    const timeLine = currentTime < (this.timeLine + (1000 * 60 * 60 * 24)) ? 'ACTIVE' : 'EXPIRED'

    return {
      id: this._id,
      assignerId: this.assignerId,
      assigneeId: this.assigneeId,
      taskId: this.taskId,
      taskStatus: this.taskStatus,
      timeLine: timeLine,
      proofs: this.proofs,
      task: this.task?.getResponse,
      service: this.service?.getResponse,
    } as IRaidResponse
  }

  set addTaskToModel(task: RaiderTaskDto) {
    this.task = task;
  }

  set addServiceToModel(service: RaiderUserServiceDto) {
    this.service = service;
  }
}

export class MultipleRaidDto implements IMultipleRaids {
  raids: RaidDto[];
  totalRaids: number;
  hasNextPage: boolean;

  constructor (raids: IMultipleRaids) {
    this.raids = raids.raids.map((raid) => new RaidDto(raid));
    this.totalRaids = raids.totalRaids;
    this.hasNextPage = raids.hasNextPage;
  }

  get getDBModel() {
    return {
      raids: this.raids.map((raid) => raid.getDBModel ),
      totalRaids: this.totalRaids,
      hasNextPage: this.hasNextPage
    } as IMultipleRaids;
  }

  get getResponse() {
    return {
      raids: this.raids.map((raid) => raid.getResponse ),
      totalRaids: this.totalRaids,
      hasNextPage: this.hasNextPage
    } as IMultipleRaidResponse;
  }
}
