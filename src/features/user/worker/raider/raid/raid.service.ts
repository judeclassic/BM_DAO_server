import { MultipleRaidDto, RaidDto } from "../../../../../types/dtos/service/raids.dto";
import ErrorInterface from "../../../../../types/interfaces/error";
import IUserModelRepository from "../../../../../types/interfaces/modules/db/models/Iuser.model";
import IRaidModelRepository from "../../../../../types/interfaces/modules/db/models/service/raid.model";
import IRaiderServiceModelRepository from "../../../../../types/interfaces/modules/db/models/service/raider.model";
import IRaiderTaskModelRepository from "../../../../../types/interfaces/modules/db/models/task/Iraider.model";
import { TaskStatusStatus } from "../../../../../types/interfaces/response/services/raid.response";

const ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE: ErrorInterface = {
  field: 'serviceId',
  message: 'this user have not subscribed top be a raider',
};

const ERROR_UNABLE_TO_GET_TASK: ErrorInterface = {
  field: 'taskId',
  message: 'unable to get this task',
};
const ERROR_USER_IS_NOT_A_USER: ErrorInterface = {
  field: 'serviceId',
  message: 'This raider account is expired please subscribe again',
};
const ERROR_GETING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};

const ERROR_USER_HAS_STARTED_THIS_TASK: ErrorInterface = {
  message: 'user have already aplied for this task',
};

const ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER: ErrorInterface = {
  message: 'this service do not belong to the user',
};
const ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER: ErrorInterface = {
  message: 'this raid was not created by this user',
};

class RaiderUserTaskRaidService {
  private _raiderTaskModel: IRaiderTaskModelRepository;
  private _raidModel: IRaidModelRepository;
  private _userModel: IUserModelRepository;
  private _raiderServiceModel: IRaiderServiceModelRepository;

  constructor (
    { raiderTaskModel, raidModel, raiderServiceModel, userModel } : {
      raidModel: IRaidModelRepository;
      raiderTaskModel: IRaiderTaskModelRepository;
      raiderServiceModel: IRaiderServiceModelRepository;
      userModel: IUserModelRepository;
    }){
      this._raiderTaskModel = raiderTaskModel;
      this._raidModel = raidModel;
      this._raiderServiceModel = raiderServiceModel;
      this._userModel = userModel;
  }

  public getAllUsersRaids = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaidDto }> => {
    const tasksResponse = await this._raidModel.getAllRaid({ assigneeId: userId }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getUserSingleRaid = async (raidId: string) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const raidsResponse = await this._raidModel.checkIfExist({ _id: raidId });
    if (!raidsResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: raidsResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    raidsResponse.data.addTaskToModel = tasksResponse.data;

    return { raid: raidsResponse.data };
  }

  public startRaidTask = async (userId: string, taskId: string, serviceId: string ) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const userService = await this._raiderServiceModel.checkIfExist({ _id: serviceId });
    console.log("userService: ",userService.data)

    if (!userService.data) return { errors: [ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE] };
    if ( userService.data.userId !== userId ) return { errors: [ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER] };
    if ( !userService.data.isUserSubscribed ) return { errors: [ERROR_USER_IS_NOT_A_USER] };

    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_UNABLE_TO_GET_TASK] };

    const raidExists = await this._raidModel.checkIfExist({ taskId, assigneeId: userId });
    if (raidExists.data) return { errors: [ERROR_USER_HAS_STARTED_THIS_TASK] };

    const raidResponse = await this._raidModel.createRaid(tasksResponse.data.getAssignedTask(userId));
    if (!raidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    tasksResponse.data.modifyUserRaidsNumber('add');
    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    raidResponse.data.addTaskToModel = tasksResponse.data;

    this._raiderServiceModel.updateCreatedAnalytics(userId);

    return { raid: raidResponse.data }
  }

  public cancelRaidTask = async (userId: string, raidId: string, ) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const raidResponse = await this._raidModel.checkIfExist({ _id: raidId });
    if (!raidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    if ( raidResponse.data.assigneeId !== userId ) return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };

    const tasksResponse = await this._raiderTaskModel.checkIfExist({_id: raidResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    tasksResponse.data.modifyUserRaidsNumber('remove');
    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const updatedRaidResponse = await this._raidModel.updateRaid(raidResponse.data._id!, raidResponse.data.getDBModel);
    if (!updatedRaidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    updatedRaidResponse.data.addTaskToModel = updatedTaskResponse.data;

    this._raiderServiceModel.updateCancelAnalytics(raidResponse.data.assigneeId);

    return { raid: updatedRaidResponse.data }
  }

  public completeRaidTask = async (userId: string, raidId: string, proofs: string[] ) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const raidResponse = await this._raidModel.checkIfExist({ _id: raidId });
    if (!raidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    if ( raidResponse.data.assigneeId !== userId ) return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };

    const tasksResponse = await this._raiderTaskModel.checkIfExist({_id: raidResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const updateRaidResponse = await this._raidModel.updateRaid(raidId, { proofs, taskStatus: TaskStatusStatus.COMPLETED });
    if (!updateRaidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    tasksResponse.data.modifyUserRaidsNumber('complete');
    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    raidResponse.data.addTaskToModel = updatedTaskResponse.data;

    this._raiderServiceModel.updateCompletedAnalytics(raidResponse.data.assigneeId);

    return { raid: raidResponse.data }
  }
}

export default RaiderUserTaskRaidService;