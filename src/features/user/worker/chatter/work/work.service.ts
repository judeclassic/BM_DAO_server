import { ChatTaskDto, MultipleChatTaskDto } from "../../../../../types/dtos/service/chats.dto";
import ErrorInterface from "../../../../../types/interfaces/error";
import IUserModelRepository from "../../../../../types/interfaces/modules/db/models/Iuser.model";
import IChatTaskModelRepository from "../../../../../types/interfaces/modules/db/models/service/chat.model";
import IChatterUserServiceModelRepository from "../../../../../types/interfaces/modules/db/models/service/chatter.model";
import IChatterTaskModelRepository from "../../../../../types/interfaces/modules/db/models/task/Ichatter.model";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";
import { TaskStatusStatus } from "../../../../../types/interfaces/response/services/raid.response";

const ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE: ErrorInterface = {
  field: 'serviceId',
  message: 'this user have not subscribed top be a raider',
};

const ERROR_UNABLE_TO_GET_TASK: ErrorInterface = {
  field: 'taskId',
  message: 'unable to get this task',
};

const ERROR_UNABLE_TO_GET_CHAT: ErrorInterface = {
  field: 'chatId',
  message: 'unable to get this available chat',
};

const ERROR_USER_IS_NOT_A_USER: ErrorInterface = {
  field: 'serviceId',
  message: 'This raider account is expired please subscribe again',
};
  
const ERROR_GETTING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};

const ERROR_TASK_TIME_HAVE_BEEN_FILLED_UP: ErrorInterface = {
  message: 'this time has been filled for this task',
};

const ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER: ErrorInterface = {
  message: 'this service do not belong to the user',
};

const ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER: ErrorInterface = {
  message: 'this raid was not created by this user',
};

const ERROR_CLAIM_PER_DAY: ErrorInterface = {
  message: 'you can only claim one task per day',
};

class ChatterWorkTaskService {
  private _chatterTaskModel: IChatterTaskModelRepository;
  private _chatModel: IChatTaskModelRepository;
  private _userModel: IUserModelRepository;
  private _chatterServiceModel: IChatterUserServiceModelRepository;

  constructor (
    { chatterTaskModel, chatModel, chatterServiceModel, userModel } : {
      chatModel: IChatTaskModelRepository;
      chatterTaskModel: IChatterTaskModelRepository;
      chatterServiceModel: IChatterUserServiceModelRepository;
      userModel: IUserModelRepository;
    }){
      this._chatterTaskModel = chatterTaskModel;
      this._chatModel = chatModel;
      this._chatterServiceModel = chatterServiceModel;
      this._userModel = userModel;
  }

  public getAllUsersChatters = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatTaskDto }> => {
    const tasksResponse = await this._chatModel.getAllTask({ assigneeId: userId }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getUserStatusChatters = async (userId: string, option : { limit: number; page: number,}, status: any) : Promise<{ errors?: ErrorInterface[]; tasks?: any }> => {
    const chatResponse = await this._chatModel.getAllTask({ assigneeId: userId, taskStatus: status }, option);
    if (!chatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    let tasks = []
    for (let i = 0; i <  chatResponse.data.chats.length; i++) {
      const chat = chatResponse.data.chats[i];
      let chatTask = await this._chatterTaskModel.getChatTask({_id: chat.taskId})
      let allTask = {
        chat: chat,
        task: chatTask
      }
      tasks.push(allTask)
    }
    return { tasks: tasks };
  }

  public getUserTotalStatusTask = async (userId: string, status: any) : Promise<{ errors?: ErrorInterface[]; totalTask?: any }> => {
    const chatResponse = await this._chatModel.getTotalStatusTask({ assigneeId: userId, taskStatus: status });
    if (!chatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    return { totalTask: chatResponse.data };
  }

  public getAllUserSingleChattersTask = async (userId: string, query : { chatId: string; status: any}) : Promise<{ errors?: ErrorInterface[]; task?: any }> => {
    const chatResponse = await this._chatModel.getSingleTask({_id: query.chatId, taskStatus: query.status, });
    if (!chatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    let chatTask = await this._chatterTaskModel.getChatTask({_id: chatResponse.data.taskId})
    let task = {
      chat: chatResponse.data,
      task: chatTask
    }
    return { task: task };
  }

  public getUserSingleChatter = async (raidId: string) : Promise<{ errors?: ErrorInterface[]; chat?: ChatTaskDto }> => {
    const raidsResponse = await this._chatModel.checkIfExist({ _id: raidId });
    if (!raidsResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: raidsResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    raidsResponse.data.addTaskToModel = tasksResponse.data;

    return { chat: raidsResponse.data };
  }

  public startChatTask = async (userId: string, chatId: string, serviceId: string ) : Promise<{ errors?: ErrorInterface[]; chat?: ChatTaskDto }> => {
    const userService = await this._chatterServiceModel.checkIfExist({ _id: serviceId });

    if (!userService.data) return { errors: [ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE] };
    if (userService.data.userId !== userId) return { errors: [ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER] };
    if (!userService.data.isUserSubscribed) return { errors: [ERROR_USER_IS_NOT_A_USER] };

    const now = new Date();

    const nextTimeClaim = new Date(now);
    nextTimeClaim.setDate(now.getDate() + 1);
    nextTimeClaim.setHours(0, 0, 0, 0);
    const nextTimeClaimISO = nextTimeClaim.toISOString();

    // if (userService.data.nextClaimDay > now) return { errors: [ERROR_CLAIM_PER_DAY] };

    const chatResponse = await this._chatModel.checkIfExist({ _id: chatId });
    if (!chatResponse.data) return { errors: [ERROR_UNABLE_TO_GET_CHAT] };

    const chatTaskResponse = await this._chatterTaskModel.checkIfExist({ _id: chatResponse.data.taskId });
    if (!chatTaskResponse.data) return { errors: [ERROR_UNABLE_TO_GET_TASK] };

    if ( chatResponse.data.assigneeId ) return { errors: [ERROR_TASK_TIME_HAVE_BEEN_FILLED_UP] };

    chatResponse.data.assigneeId = userId;
    chatResponse.data.taskStatus = TaskStatusStatus.STARTED;
    const updatedChatResponse = await this._chatModel.updateTask(chatId, chatResponse.data);
    if (!updatedChatResponse.data) return { errors: [ERROR_UNABLE_TO_GET_CHAT] };
    
    chatTaskResponse.data.modifyUserChattersNumber('add');
    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(chatResponse.data.taskId, chatTaskResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    updatedChatResponse.data.task = updatedTaskResponse.data;

    this._chatterServiceModel.updateNextClaimable(userId, now, nextTimeClaimISO)
    this._chatterServiceModel.updateCreatedAnalytics(userId);
    this._userModel.updateCompletedAnalytics(userId, ServiceAccountTypeEnum.raider);

    return { chat: updatedChatResponse.data }
  }

  public cancelChatterTask = async (userId: string, raidId: string, ) : Promise<{ errors?: ErrorInterface[]; raid?: ChatTaskDto }> => {
    const chatResponse = await this._chatModel.checkIfExist({ _id: raidId });
    if (!chatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    if ( chatResponse.data.assigneeId !== userId ) return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };

    const chatTaskResponse = await this._chatterTaskModel.checkIfExist({_id: chatResponse.data.taskId });
    if (!chatTaskResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    chatTaskResponse.data.modifyUserChattersNumber('remove');
    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(chatResponse.data.taskId, chatTaskResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    const updatedChatResponse = await this._chatModel.updateTask(chatResponse.data.id!, chatTaskResponse.data.getDBModel);
    if (!updatedChatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    updatedChatResponse.data.addTaskToModel = updatedTaskResponse.data;

    updatedChatResponse.data.assigneeId
      && this._chatterServiceModel.updateCancelAnalytics(updatedChatResponse.data.assigneeId);

    this._userModel.updateCancelAnalytics(userId, ServiceAccountTypeEnum.raider);

    return { raid: updatedChatResponse.data }
  }

  public completeChatterTask = async (userId: string, chatId: string, proofs: string[] ) : Promise<{ errors?: ErrorInterface[]; chat?: ChatTaskDto }> => {
    const chatResponse = await this._chatModel.checkIfExist({ _id: chatId });
    if (!chatResponse.data) return { errors: [ERROR_UNABLE_TO_GET_CHAT] };

    if ( chatResponse.data.assigneeId !== userId ) return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };

    const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: chatResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    chatResponse.data.proofs = proofs;
    chatResponse.data.taskStatus = TaskStatusStatus.COMPLETED;
    tasksResponse.data.modifyUserChattersNumber('complete');

    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(chatResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    chatResponse.data.taskStatus = TaskStatusStatus.COMPLETED;
    const updatedChatResponse = await this._chatModel.updateTask(chatId, chatResponse.data);
    if (!updatedChatResponse.data) return { errors: [ERROR_UNABLE_TO_GET_CHAT] };

    chatResponse.data.addTaskToModel = updatedTaskResponse.data;

    this._chatterServiceModel.updateCompletedAnalytics(chatResponse.data.assigneeId);
    this._userModel.updateCompletedAnalytics(chatResponse.data.assigneeId, ServiceAccountTypeEnum.raider);

    return { chat: chatResponse.data }
  }
}

export default ChatterWorkTaskService;