import { RaidDto, MultipleRaidDto } from "../../../../../../types/dtos/service/raids.dto";
import { MultipleRaiderTaskDto, RaiderTaskDto } from "../../../../../../types/dtos/task/raiders.dto";
import ErrorInterface from "../../../../../../types/interfaces/error";
import IModeratorServiceModelRepository from "../../../../../../types/interfaces/modules/db/models/service/moderator.model";
import IRaidModelRepository from "../../../../../../types/interfaces/modules/db/models/service/raid.model";
import IRaiderTaskModelRepository from "../../../../../../types/interfaces/modules/db/models/task/Iraider.model";
import { TaskPriorityEnum } from "../../../../../../types/interfaces/response/task/raider_task.response";

const ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE: ErrorInterface = {
  field: 'userId',
  message: 'this user have not subscribed to be a moderator',
};

const ERROR_UNABLE_TO_GET_TASK: ErrorInterface = {
  field: 'taskId',
  message: 'unable to get this task',
};

const ERROR_USER_IS_NOT_A_CLIENT: ErrorInterface = {
  field: 'user',
  message: 'user not found with this user Id',
};

const ERROR_GETING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};

const ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER: ErrorInterface = {
  message: 'this service do not belong to the user',
};

const ERROR_THIS_TASK_HAS_A_MODERATOR_ALREADY: ErrorInterface = {
  message: 'This task already have a moderator',
};

const ERROR_THIS_TASK_IS_ALREADY_MODERATED_BY_YOU: ErrorInterface = {
  message: 'This task is being moderated by you already',
};

class ModeratorUserTaskService {
  private _raidModel: IRaidModelRepository;
  private _raiderTaskModel: IRaiderTaskModelRepository;
  private _moderatorServiceModel: IModeratorServiceModelRepository;

  constructor (
    { raiderTaskModel, raidModel, moderatorServiceModel } : {
      raidModel: IRaidModelRepository;
      raiderTaskModel: IRaiderTaskModelRepository;
      moderatorServiceModel: IModeratorServiceModelRepository;
    }){
      this._raidModel = raidModel;
      this._raiderTaskModel = raiderTaskModel;
      this._moderatorServiceModel = moderatorServiceModel;
  }

  public getAllActiveTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getActiveTask({ level: TaskPriorityEnum.high, isModerated: false }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getAllOtherTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getActiveTask({ level: TaskPriorityEnum.low, isModerated: false }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getAllModeratorTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getActiveTask({ moderatorId: userId, level: TaskPriorityEnum.high }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getAllModeratorOtherTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getActiveTask({ moderatorId: userId, level: TaskPriorityEnum.low }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getRaiderSingleRaid = async (raidId: string) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const raidsResponse = await this._raidModel.checkIfExist({ _id: raidId });
    if (!raidsResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: raidsResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    raidsResponse.data.addTaskToModel = tasksResponse.data;

    return { raid: raidsResponse.data };
  }

  public getModeratorTask = async (taskId: string) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: taskId, level: TaskPriorityEnum.high });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { task: tasksResponse.data };
  }

  public moderateTask = async (userId: string, taskId: string, serviceId: string ) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {
    const userService = await this._moderatorServiceModel.checkIfExist({ _id: serviceId });
    if (!userService.data) return { errors: [ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE] };

    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_UNABLE_TO_GET_TASK] };

    if ( userService.data.userId !== userId ) return { errors: [ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER] };
    if ( !userService.data.isUserSubscribed ) return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };

    if ( tasksResponse.data.moderatorId === userId ) return { errors: [ERROR_THIS_TASK_IS_ALREADY_MODERATED_BY_YOU] }
    if ( tasksResponse.data.isModerated ) return { errors: [ERROR_THIS_TASK_HAS_A_MODERATOR_ALREADY] }

    tasksResponse.data.addModerator = userService.data;
    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);

    return { task: updatedTaskResponse.data }
  }

  public getModeratorRaidersRaid = async ( taskId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; raids?: MultipleRaidDto }> => {
    const raidsResponse = await this._raidModel.getAllRaid({ taskId }, option);
    if (!raidsResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { raids: raidsResponse.data };
  }

  public rejectRaid = async ( userId: string, raidId: string ) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const tasksResponse = await this._raiderTaskModel.checkIfExist({ moderatorId: userId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const raidResponse = await this._raidModel.checkIfExist({ _id: raidId });
    if (!raidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    if (raidResponse.data.taskId === tasksResponse.data._id) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    tasksResponse.data.modifyUserRaidsNumber('remove');

    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    raidResponse.data.addTaskToModel = updatedTaskResponse.data;

    return { raid: raidResponse.data }
  }

  public approveTaskAsComplete = async ( userId: string, taskId: string ) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.checkIfExist({_id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { task: updatedTaskResponse.data }
  }
}

export default ModeratorUserTaskService;
