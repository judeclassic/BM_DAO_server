import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import { RaiderTaskDto, MultipleRaiderTaskDto } from "../../../../../types/dtos/task/raiders.dto";
import { AmountEnum } from "../../../../../types/dtos/user.dto";
import ErrorInterface from "../../../../../types/interfaces/error";
import IUserModelRepository from "../../../../../types/interfaces/modules/db/models/Iuser.model";
import IRaiderServiceModelRepository from "../../../../../types/interfaces/modules/db/models/service/raider.model";
import IRaiderTaskModelRepository from "../../../../../types/interfaces/modules/db/models/task/Iraider.model";
import { ICreateRaiderGigRequest, ICreateRaiderTaskRequest } from "../../../../../types/interfaces/requests/task/raider";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";
import { RaidActionEnum, TaskPriorityEnum } from "../../../../../types/interfaces/response/task/raider_task.response";
import { TransactionStatusEnum, TransactionTypeEnum } from "../../../../../types/interfaces/response/transaction.response";
import { AccountTypeEnum } from "../../../../../types/interfaces/response/user.response";

const ERROR_UNABLE_TO_CREATE_TASK: ErrorInterface = {
  field: 'user',
  message: 'unable to create task',
};
const ERROR_USER_NOT_FOUND: ErrorInterface = {
  field: 'user',
  message: 'user not found with this user Id',
};
const ERROR_UNABLE_TO_GET_SINGLE_TASK: ErrorInterface = {
  message: 'unable ',
};
const ERROR_UNABLE_TO_UPDATE_USER_BALANCE: ErrorInterface = {
  message: 'unable to update user balance',
};
const ERROR_USER_IS_NOT_A_CLIENT: ErrorInterface = {
  field: 'user',
  message: 'user not found with this user Id',
};
const ERROR_NOT_ENOUGH_BALANCE: ErrorInterface = {
  message: 'user do not have enough balance please recharge',
};
const ERROR_GETING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};
const ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER: ErrorInterface = {
  message: 'we do not have enough raiders to complete this task',
};

class RaiderClientTaskService {
  private _transactionModel: TransactionModel;
  private _userModel: IUserModelRepository;
  private _raiderTaskModel: IRaiderTaskModelRepository;
  private _raiderServiceModel: IRaiderServiceModelRepository;

  constructor (
    { raiderTaskModel, userModel, raiderServiceModel, transactionModel } : {
      userModel: IUserModelRepository;
      raiderTaskModel: IRaiderTaskModelRepository;
      raiderServiceModel: IRaiderServiceModelRepository;
      transactionModel: TransactionModel;
    }){
      this._raiderTaskModel = raiderTaskModel;
      this._userModel = userModel;
      this._raiderServiceModel = raiderServiceModel;
      this._transactionModel = transactionModel;
  }

  public createRaidTask = async (userId: string, task : ICreateRaiderGigRequest) : Promise<{ errors?: ErrorInterface[]; tasks?: RaiderTaskDto[] }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });
    if (!user.data) return { errors: [ERROR_USER_NOT_FOUND] };

    if ( user.data?.accountType === AccountTypeEnum.user) return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };

    user.data.referal.isGiven = true;
    const isWithdrawed = user.data.updateUserWithdrawableBalance({ 
      amount: AmountEnum.raidClientRaidCharge,
      multiplier: task.dailyPost * task.raidersNumber * task.weeks * 7,
      type: 'charged'
    });

    if (!isWithdrawed) return { errors: [ERROR_NOT_ENOUGH_BALANCE] };

    const userServiceResponse = await this._raiderServiceModel.countUsersInPlatform({});
    if (!userServiceResponse.data) {
      return { errors: [ERROR_USER_NOT_FOUND] }
    }

    if ( userServiceResponse.data < task.raidersNumber) 
      return { errors: [ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER] };

    const updatedUser = await this._userModel.checkIfExist({ _id: userId });
    if (!updatedUser.data) return { errors: [ERROR_UNABLE_TO_UPDATE_USER_BALANCE] };

    const createdTasks: RaiderTaskDto[] = [];

    for (let i = 0; i < (7 * task.weeks); i++) {
      const startDate = Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24 * (i));
      const endDate = Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24 * (i + 1));

      for (let j = 0; j < task.dailyPost; j++) {
        const actions = Object.values(RaidActionEnum);

        for (const element of actions) {
          const createdTask = await this._raiderTaskModel.saveTaskToDB({
            userId: userId,
            startedAt: new Date(startDate),
            endedAt: new Date(endDate),
            raidInformation: {
              action: element,
              raidLink: task.raidLink,
              campaignCaption: task.compaignCaption,
              amount: task.raidersNumber,
            },
            availableRaids: task.raidersNumber,
            totalRaids: task.raidersNumber,
            completedRaids: 0,
            updatedAt: new Date(),
            createdAt: new Date(),
            isVerified: false,
            startTimeLine: startDate,
            endTimeLine: endDate,
            level: TaskPriorityEnum.high
          });

          if (!createdTask.data) {
            return { errors: [ERROR_UNABLE_TO_CREATE_TASK] };
          }
  
          createdTasks.push(createdTask.data);
        }
      }
    }

    return { tasks: createdTasks }
  }

  public createTask = async (userId: string, task : ICreateRaiderTaskRequest) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {
    console.log(userId)
    const user = await this._userModel.checkIfExist({ _id: userId });
    console.log(user);

    if (!user.data) return { errors: [ERROR_USER_NOT_FOUND] };

    if ( user.data?.accountType === AccountTypeEnum.user) return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };

    user.data.referal.isGiven = true;
    const isWithdrawed = user.data.updateUserWithdrawableBalance({ 
      amount: RaiderTaskDto.getPricingByAction(task.action),
      multiplier: task.numbers,
      type: 'charged'
    });
    
    if (!isWithdrawed) return { errors: [ERROR_NOT_ENOUGH_BALANCE] };

    const updatedUser = await this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
    if (!updatedUser.data) {
      return { errors: [ERROR_UNABLE_TO_CREATE_TASK] }
    }

    const userServiceResponse = await this._raiderServiceModel.countUsersInPlatform({});
    console.log("userServiceResponse: ", userServiceResponse)
    if (userServiceResponse.data === undefined) {
      return { errors: [ERROR_USER_NOT_FOUND] }
    }

    if ( userServiceResponse.data < task.numbers )
      return { errors: [ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER] };

    const endDate = new Date(Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24));

    const createdTask = await this._raiderTaskModel.saveTaskToDB({
      userId: userId,
      startedAt: new Date(task.startDate),
      endedAt: endDate,
      raidInformation: {
        action: task.action,
        raidLink: task.raidLink,
        campaignCaption: task.campaignCaption,
        amount: task.numbers,
      },
      availableRaids: task.numbers,
      totalRaids: task.numbers,
      completedRaids: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
      isVerified: false,
      startTimeLine: Date.parse((new Date(task.startDate)).toISOString()),
      endTimeLine: Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24),
      level: TaskPriorityEnum.low
    });

    if (!createdTask.data) {
      return { errors: [ERROR_UNABLE_TO_CREATE_TASK] }
    }

    this._transactionModel.saveTransaction({
      name: updatedUser.data.name,
      userId: user.data.id,
      updatedAt: new Date(),
      createdAt: new Date(),
      transactionType: TransactionTypeEnum.TASK_CREATION,
      transactionStatus: TransactionStatusEnum.COMPLETED,
      amount: (RaiderTaskDto.getPricingByAction(task.action) * task.numbers),
      isVerified: true,
    });

    this._userModel.updateUpdatedAnalytics(userId, ServiceAccountTypeEnum.raider);

    return { task: createdTask.data }
  }

  public getAllUserTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getAllTask({ userId }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getActiveTasks = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleRaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.getFutureTask({ userId }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getUserSingleTask = async (userId: string, taskId: string) : Promise<{ errors?: ErrorInterface[]; task?: RaiderTaskDto }> => {
    const tasksResponse = await this._raiderTaskModel.checkIfExist({ userId });
    if (!tasksResponse.data) return { errors: [ERROR_UNABLE_TO_GET_SINGLE_TASK] };

    return { task: tasksResponse.data };
  }

  
}

export default RaiderClientTaskService;
