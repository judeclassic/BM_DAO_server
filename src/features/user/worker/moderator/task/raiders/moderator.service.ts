import TransactionModel from "../../../../../../lib/modules/db/models/transaction.model";
import { RaidDto, MultipleRaidDto } from "../../../../../../types/dtos/service/raids.dto";
import { ModeratorTaskDto } from "../../../../../../types/dtos/task/moderator.dto";
import { MultipleRaiderTaskDto, RaiderTaskDto } from "../../../../../../types/dtos/task/raiders.dto";
import UserDto, { AmountEnum } from "../../../../../../types/dtos/user.dto";
import ErrorInterface from "../../../../../../types/interfaces/error";
import IUserModelRepository from "../../../../../../types/interfaces/modules/db/models/Iuser.model";
import IModeratorServiceModelRepository from "../../../../../../types/interfaces/modules/db/models/service/moderator.model";
import IRaidModelRepository from "../../../../../../types/interfaces/modules/db/models/service/raid.model";
import IRaiderServiceModelRepository from "../../../../../../types/interfaces/modules/db/models/service/raider.model";
import IRaiderTaskModelRepository from "../../../../../../types/interfaces/modules/db/models/task/Iraider.model";
import { ServiceAccountTypeEnum } from "../../../../../../types/interfaces/response/services/enums";
import { TaskStatusStatus } from "../../../../../../types/interfaces/response/services/raid.response";
import { TaskPriorityEnum } from "../../../../../../types/interfaces/response/task/raider_task.response";
import { TransactionStatusEnum, TransactionTypeEnum } from "../../../../../../types/interfaces/response/transaction.response";

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

const ERROR_GETTING_THIS_USER_SERVICE: ErrorInterface = {
  message: 'error getting the raider service and social handles',
};

const ERROR_THIS_TASK_IS_ALREADY_MODERATED_BY_YOU: ErrorInterface = {
  message: 'This task is being moderated by you already',
};

const ERROR_GETTING_THIS_TASK: ErrorInterface = {
  message: 'Error fetching this task',
};

const ERROR_GETTING_THIS_RAID: ErrorInterface = {
  message: 'Error fetching this raid',
};

class ModeratorUserTaskService {
  private _raidModel: IRaidModelRepository;
  private _userModel: IUserModelRepository;
  private _raiderTaskModel: IRaiderTaskModelRepository;
  private _raiderServiceModel: IRaiderServiceModelRepository;
  private _moderatorServiceModel: IModeratorServiceModelRepository;
  private _transactionModel: TransactionModel;

  constructor (
    { raiderTaskModel, raidModel, moderatorServiceModel, raiderServiceModel, userModel, transactionModel } : {
      raidModel: IRaidModelRepository;
      raiderTaskModel: IRaiderTaskModelRepository;
      raiderServiceModel: IRaiderServiceModelRepository;
      moderatorServiceModel: IModeratorServiceModelRepository;
      userModel: IUserModelRepository;
      transactionModel: TransactionModel;
    }){
      this._raidModel = raidModel;
      this._raiderTaskModel = raiderTaskModel;
      this._moderatorServiceModel = moderatorServiceModel;
      this._raiderServiceModel = raiderServiceModel;
      this._userModel = userModel;
      this._transactionModel = transactionModel;
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

  public getSingleTask = async (taskId: string) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {

    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { task: tasksResponse.data };
  }

  public getRaiderSingleRaid = async (raidId: string) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const raidsResponse = await this._raidModel.checkIfExist({ _id: raidId });
    if (!raidsResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };  

    const tasksResponse = await this._raiderTaskModel.checkIfExist({ _id: raidsResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    console.log('raidsResponse: ', raidsResponse)

    const raiderService = await this._raiderServiceModel.checkIfExist({ _id: raidsResponse.data.serviceId });
    if (!raiderService.data) return { errors: [ERROR_GETTING_THIS_USER_SERVICE] };

    raidsResponse.data.addTaskToModel = tasksResponse.data;
    raidsResponse.data.addServiceToModel = raiderService.data;

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
    this._raiderServiceModel.updateCreatedAnalytics(userId);

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

    const raidResponse = await this._raidModel.checkIfExist({ _id: raidId })
    if (!raidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    if (raidResponse.data.taskId === tasksResponse.data._id) return { errors: [ERROR_GETTING_THIS_RAID] };
    if (raidResponse.data.taskStatus === TaskStatusStatus.APPROVED) return { errors: [{message: 'this raid has been approved already'}] };
    if (raidResponse.data.taskStatus === TaskStatusStatus.REJECTED) return { errors: [{message: 'this raid has been rejected already'}] };

    if (raidResponse.data.taskId === tasksResponse.data._id) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    tasksResponse.data.modifyUserRaidsNumber('remove');

    const updatedRaidResponse = await this._raidModel.updateRaid(raidId, { taskStatus: TaskStatusStatus.REJECTED })
    if (!updatedRaidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    updatedRaidResponse.data.addTaskToModel = updatedTaskResponse.data;
    this._raiderServiceModel.updateCancelAnalytics(updatedRaidResponse.data.assigneeId);

    return { raid: updatedRaidResponse.data }
  }

  public approveRaid = async ( userId: string, raidId: string ) : Promise<{ errors?: ErrorInterface[]; raid?: RaidDto }> => {
    const tasksResponse = await this._raiderTaskModel.checkIfExist({ moderatorId: userId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    const raidResponse = await this._raidModel.checkIfExist({ _id: raidId })
    if (!raidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    if (raidResponse.data.taskId === tasksResponse.data._id) return { errors: [ERROR_GETTING_THIS_RAID] };
    if (raidResponse.data.taskStatus === TaskStatusStatus.APPROVED) return { errors: [{message: 'this raid has been approved already'}] };
    if (raidResponse.data.taskStatus === TaskStatusStatus.REJECTED) return { errors: [{message: 'this raid has been rejected already'}] };

    const updatedRaidResponse = await this._raidModel.updateRaid(raidId, { taskStatus: TaskStatusStatus.APPROVED })
    if (!updatedRaidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    updatedRaidResponse.data.addTaskToModel = tasksResponse.data

    await Promise.all([
      this._userModel.updateBalance(updatedRaidResponse.data.assigneeId, RaiderTaskDto.getPricingByAction(tasksResponse.data?.raidInformation.action)),
      this._transactionModel.saveTransaction({
        name: TransactionTypeEnum.RAIDER_SUBSCRIPTION,
        userId: raidResponse.data.assigneeId,
        updatedAt: new Date(),
        createdAt: new Date(),
        transactionType: TransactionTypeEnum.RAIDER_SUBSCRIPTION,
        transactionStatus: TransactionStatusEnum.COMPLETED,
        amount: RaiderTaskDto.getPricingByAction(tasksResponse.data?.raidInformation.action),
        isVerified: true,
      })
    ]);

    return { raid: updatedRaidResponse.data }
  }

  public approveTaskAsComplete = async ( userId: string, taskId: string ) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.checkIfExist({_id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    const updatedTaskResponse = await this._raiderTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    await this._userModel.updateCompletedAnalytics(tasksResponse.data.userId, ServiceAccountTypeEnum.raider);

    const raidsResponse = await this._raidModel.getAllRaids([{ taskId, taskStatus: TaskStatusStatus.STARTED }]);
    if (!raidsResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    Promise.all(raidsResponse.data.map((raid) => {
      this._userModel.updateBalance(raid.assigneeId, RaiderTaskDto.getPricingByAction(tasksResponse.data?.raidInformation.action!));
      this._transactionModel.saveTransaction({
        name: TransactionTypeEnum.RAIDER_SUBSCRIPTION,
        userId: raid.assigneeId,
        updatedAt: new Date(),
        createdAt: new Date(),
        transactionType: TransactionTypeEnum.RAIDER_SUBSCRIPTION,
        transactionStatus: TransactionStatusEnum.COMPLETED,
        amount: (RaiderTaskDto.getPricingByAction(tasksResponse.data?.raidInformation.action!)),
        isVerified: true,
      });
    }));
    this._moderatorServiceModel.updateCompletedAnalytics(userId);
    const user = await this._userModel.updateCompletedAnalytics(userId, ServiceAccountTypeEnum.raider);
    if (!user.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    user.data.updateUserWithdrawableBalance({
      amount: ModeratorTaskDto.getRaiderPayoutByAction(updatedTaskResponse.data?.raidInformation.action),
      multiplier: tasksResponse.data.raidInformation.amount,
      type: 'paid'
    })

    const updatedUser = await this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
    if (!updatedUser.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    await this._raidModel.deleteAllRaids({ taskId });

    return { task: updatedTaskResponse.data }
  }
}

export default ModeratorUserTaskService;
