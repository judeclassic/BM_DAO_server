import { MultipleRaiderTaskDto, RaiderTaskDto } from "../../../../../types/dtos/task/raiders.dto";
import ErrorInterface from "../../../../../types/interfaces/error";
import IRaiderTaskModelRepository from "../../../../../types/interfaces/modules/db/models/task/Iraider.model";
import { TaskStatusStatus } from "../../../../../types/interfaces/response/services/raid.response";
import { TaskPriorityEnum } from "../../../../../types/interfaces/response/task/raider_task.response";

const ERROR_GETING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};

class RaiderUserTaskService {
  private _raiderTaskModel: IRaiderTaskModelRepository;

  constructor (
    { raiderTaskModel } : {
      raiderTaskModel: IRaiderTaskModelRepository;
    }){
      this._raiderTaskModel = raiderTaskModel;
  }

  public getAllActiveTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getActiveTask({ level: TaskPriorityEnum.high }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getActiveTaskForDay = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getActiveTaskForDay({}, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }


  public getAllOtherTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getActiveTask({ level: TaskPriorityEnum.low }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getUserSingleTask = async ( taskId : string ) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { task: tasksResponse.data };
  }
}

export default RaiderUserTaskService;