import { ChatTaskDto, MultipleChatTaskDto } from "../../../../../types/dtos/service/chats.dto";
import { RaidDto } from "../../../../../types/dtos/service/raids.dto";
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

const ERROR_USER_IS_NOT_A_USER: ErrorInterface = {
  field: 'serviceId',
  message: 'This raider account is expired please subscribe again',
};
  
const ERROR_GETING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};

const ERROR_TASK_HAVE_BEEN_FILLED_UP: ErrorInterface = {
  message: 'this task have been filled with users',
};

const ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER: ErrorInterface = {
  message: 'this service do not belong to the user',
};

const ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER: ErrorInterface = {
  message: 'this raid was not created by this user',
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

  public getAllUsersRaids = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatTaskDto }> => {
    const tasksResponse = await this._chatModel.getAllTask({ assigneeId: userId }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getUserSingleRaid = async (raidId: string) : Promise<{ errors?: ErrorInterface[]; chat?: ChatTaskDto }> => {
    const raidsResponse = await this._chatModel.checkIfExist({ _id: raidId });
    if (!raidsResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: raidsResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    raidsResponse.data.addTaskToModel = tasksResponse.data;

    return { chat: raidsResponse.data };
  }

  public startChatTask = async (userId: string, chatId: string, serviceId: string ) : Promise<{ errors?: ErrorInterface[]; chat?: ChatTaskDto }> => {
    const userService = await this._chatterServiceModel.checkIfExist({ _id: serviceId });

    if (!userService.data) return { errors: [ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE] };
    if ( userService.data.userId !== userId ) return { errors: [ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER] };
    if ( !userService.data.isUserSubscribed ) return { errors: [ERROR_USER_IS_NOT_A_USER] };

    const chatTaskResponse = await this._chatterTaskModel.checkIfExist({ _id: chatId });
    if (!chatTaskResponse.data) return { errors: [ERROR_UNABLE_TO_GET_TASK] };

    const chatResponse = await this._chatModel.checkIfExist({ _id: chatId });
    if (!chatResponse.data) return { errors: [ERROR_UNABLE_TO_GET_TASK] };

    if (!chatResponse.data.assigneeId !== undefined ) return { errors: [ERROR_TASK_HAVE_BEEN_FILLED_UP] };

    chatTaskResponse.data.modifyUserChattersNumber('add');
    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(chatResponse.data.taskId, chatTaskResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    this._chatterServiceModel.updateCreatedAnalytics(userId);
    this._userModel.updateCompletedAnalytics(userId, ServiceAccountTypeEnum.raider);

    return { chat: chatResponse.data }
  }

  public cancelRaidTask = async (userId: string, raidId: string, ) : Promise<{ errors?: ErrorInterface[]; raid?: ChatTaskDto }> => {
    const chatResponse = await this._chatModel.checkIfExist({ _id: raidId });
    if (!chatResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    if ( chatResponse.data.assigneeId !== userId ) return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };

    const chatTaskResponse = await this._chatterTaskModel.checkIfExist({_id: chatResponse.data.taskId });
    if (!chatTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    chatTaskResponse.data.modifyUserChattersNumber('remove');
    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(chatResponse.data.taskId, chatTaskResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const updatedChatResponse = await this._chatModel.updateTask(chatResponse.data.id!, chatTaskResponse.data.getDBModel);
    if (!updatedChatResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    updatedChatResponse.data.addTaskToModel = updatedTaskResponse.data;

    updatedChatResponse.data.assigneeId
      && this._chatterServiceModel.updateCancelAnalytics(updatedChatResponse.data.assigneeId);

    this._userModel.updateCancelAnalytics(userId, ServiceAccountTypeEnum.raider);

    return { raid: updatedChatResponse.data }
  }

  public completeRaidTask = async (userId: string, raidId: string, proofs: string[] ) : Promise<{ errors?: ErrorInterface[]; chat?: ChatTaskDto }> => {
    const raidResponse = await this._chatModel.checkIfExist({ _id: raidId });
    if (!raidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    if ( raidResponse.data.assigneeId !== userId ) return { errors: [ERROR_RAID_DO_NOT_BELONG_TO_THIS_USER] };

    const tasksResponse = await this._chatterTaskModel.checkIfExist({_id: raidResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const updateRaidResponse = await this._chatModel.updateTask(raidId, { proofs, taskStatus: TaskStatusStatus.COMPLETED });
    if (!updateRaidResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    tasksResponse.data.modifyUserChattersNumber('complete');
    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(raidResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    raidResponse.data.addTaskToModel = updatedTaskResponse.data;

    this._chatterServiceModel.updateCompletedAnalytics(raidResponse.data.assigneeId);
    this._userModel.updateCompletedAnalytics(raidResponse.data.assigneeId, ServiceAccountTypeEnum.raider);

    return { chat: raidResponse.data }
  }
}

export default ChatterWorkTaskService;