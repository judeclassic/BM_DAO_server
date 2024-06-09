import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import { ChatTaskDto } from "../../../../../types/dtos/service/chats.dto";
import { ChatterTaskDto, MultipleChatterTaskDto } from "../../../../../types/dtos/task/chatters.dto";
import { AmountEnum } from "../../../../../types/dtos/user.dto";
import ErrorInterface from "../../../../../types/interfaces/error";
import IUserModelRepository from "../../../../../types/interfaces/modules/db/models/Iuser.model";
import IChatTaskModelRepository from "../../../../../types/interfaces/modules/db/models/service/chat.model";
import IChatterUserServiceModelRepository from "../../../../../types/interfaces/modules/db/models/service/chatter.model";
import IChatterTaskModelRepository from "../../../../../types/interfaces/modules/db/models/task/Ichatter.model";
import { ICreateChatterGigRequest } from "../../../../../types/interfaces/requests/task/chatter";
import { TaskStatusStatus } from "../../../../../types/interfaces/response/services/chatter/chat_cliamable.response";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";
import {  TaskPriorityEnum } from "../../../../../types/interfaces/response/task/raider_task.response";
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
  message: 'we do not have enough chatters to complete this task',
};

const ERROR_CHAT_NOT_FOUND: ErrorInterface = {
  field: 'chat',
  message: 'unable to fetch all chat',
};

class ChatterClientTaskService {
  private _transactionModel: TransactionModel;
  private _userModel: IUserModelRepository;
  private _chatTaskModel: IChatTaskModelRepository;
  private _chatterTaskModel: IChatterTaskModelRepository;
  private _chatterServiceModel: IChatterUserServiceModelRepository;

  constructor (
    { chatTaskModel, chatterTaskModel, userModel, chatterServiceModel, transactionModel } : {
      userModel: IUserModelRepository;
      chatTaskModel: IChatTaskModelRepository;
      chatterTaskModel: IChatterTaskModelRepository;
      chatterServiceModel: IChatterUserServiceModelRepository;
      transactionModel: TransactionModel;
    }){
      this._chatterTaskModel = chatterTaskModel;
      this._chatTaskModel = chatTaskModel;
      this._userModel = userModel;
      this._chatterServiceModel = chatterServiceModel;
      this._transactionModel = transactionModel;
  }

  public createTask = async (userId: string, task : ICreateChatterGigRequest) : Promise<{ errors?: ErrorInterface[]; task?: ChatterTaskDto }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });

    if (!user.data) return { errors: [ERROR_USER_NOT_FOUND] };

    if ( user.data?.accountType === AccountTypeEnum.user) return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };

    const userServiceCountResponse = await this._chatterServiceModel.countUsersInPlatform({});
    
    if (userServiceCountResponse.data === undefined) {
      return { errors: [ERROR_USER_NOT_FOUND] }
    }
  
    let totalAvailbleTask
    const totalAvailbleTaskResponse = await this._chatTaskModel.countAvailbleChatPerDay({taskStatus: TaskStatusStatus.PENDING})
    if (!totalAvailbleTaskResponse.status) {
      totalAvailbleTask = 0
    }else{
      totalAvailbleTask = totalAvailbleTaskResponse.data
    }

    let totalClaimableTask
    const totalClaimableTaskResponse = await this._chatTaskModel.countAvailbleChatPerDay({taskStatus: TaskStatusStatus.STARTED})
    if (!totalClaimableTaskResponse.status) {
      totalClaimableTask = 0
    }else{
      totalClaimableTask = totalClaimableTaskResponse.data
    }

    const currentAvailableUser = userServiceCountResponse.data - (totalAvailbleTask + totalClaimableTask)

    if ( currentAvailableUser < (task.chatterPerSession * task.hoursPerDay ) )
      return { errors: [ERROR_USER_NUMBERS_ARE_BELOW_REQUIRED_NUMBER] };

    user.data.referal.isGiven = true;
    const isWithdrawed = user.data.updateUserWithdrawableBalance({ 
      amount: AmountEnum.chatterCharge,
      multiplier: (task.chatterPerSession * task.hoursPerDay, task.days ),
      type: 'charged'
    });
    
    if (!isWithdrawed) return { errors: [ERROR_NOT_ENOUGH_BALANCE] };

    const updatedUser = await this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
    if (!updatedUser.data) {
      return { errors: [ERROR_UNABLE_TO_CREATE_TASK] }
    }

    const endDate = new Date(Date.parse((new Date(task.startDate)).toISOString()) + (1000 * 3600 * 24));

    const createdTask = await this._chatterTaskModel.saveTaskToDB({
      userId: userId,
      startedAt: new Date(task.startDate),
      endedAt: endDate,
      chatInformation: {
        serviceType: ServiceAccountTypeEnum.chatter,
        postLink: task.postLink,
        compaignCaption: task.compaignCaption,
        chatterPerSession: task.chatterPerSession,
        hoursPerDay: task.hoursPerDay,
        startDate: task.startDate,
        days: task.days,
      },
      availableTask: (task.chatterPerSession * task.hoursPerDay, task.days ),
      totalTasks: (task.chatterPerSession * task.hoursPerDay, task.days ),
      completedTasks: 0,
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

    const claimableTask : Promise<{
        status: boolean;
        error?: any;
        data?: ChatTaskDto;
    }>[] = [];

    for (let dayNum = 0; dayNum < task.days; dayNum++) {
      let startDay = new Date(task.startDate);
      let startDayNum = Date.parse(startDay.toISOString()) + ((dayNum) * 24 * 60 * 60 * 1000);
      for (let timeNum = 0; timeNum < task.hoursPerDay; timeNum++ ) {
        let startTime = startDayNum + ((timeNum + 1) * 60 * 60 * 1000);
        for (let userNum = 0; userNum < task.chatterPerSession; userNum++) {
          let response = this._chatTaskModel.createTask({
            assignerId: userId,
            taskId: createdTask.data.id!,
            task: createdTask.data.id as any,
            startTime: startTime,
            endTime: startTime + (60 * 60 * 1000),
            timeLine: (60 * 60 * 1000),
            taskStatus: TaskStatusStatus.PENDING
          })
          claimableTask.push(response);
        }
      }
    }

    this._transactionModel.saveTransaction({
      name: updatedUser.data.name,
      userId: user.data.id,
      updatedAt: new Date(),
      createdAt: new Date(),
      transactionType: TransactionTypeEnum.TASK_CREATION,
      transactionStatus: TransactionStatusEnum.COMPLETED,
      amount: (AmountEnum.chatterCharge * (task.chatterPerSession * task.hoursPerDay, task.days )),
      isVerified: true,
    });

    // let taskArray = await Promise.all(claimableTask);
    // console.log(taskArray)

    // for (let task of taskArray) {
    //   if (task.data) {
    //     createdTask.data.claimableTask.push(task.data)
    //   }
    // }

    this._userModel.updateUpdatedAnalytics(userId, ServiceAccountTypeEnum.raider);

    return { task: createdTask.data }
  }

  public getAllUserTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.getAllTask({ userId }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getActiveTasks = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.getFutureTask({ userId }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getUserSingleTask = async (userId: string, taskId: string) : Promise<{ errors?: ErrorInterface[]; task?: ChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.checkIfExist({ userId });
    if (!tasksResponse.data) return { errors: [ERROR_UNABLE_TO_GET_SINGLE_TASK] };

    return { task: tasksResponse.data };
  }

  
}

export default ChatterClientTaskService;
