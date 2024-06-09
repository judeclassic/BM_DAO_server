import { MultipleChatTaskDto } from "../../../../../types/dtos/service/chats.dto";
import { ChatterTaskDto, MultipleChatterTaskDto } from "../../../../../types/dtos/task/chatters.dto";
import ErrorInterface from "../../../../../types/interfaces/error";
import IChatTaskModelRepository from "../../../../../types/interfaces/modules/db/models/service/chat.model";
import IChatterTaskModelRepository from "../../../../../types/interfaces/modules/db/models/task/Ichatter.model";
import { TaskStatusStatus } from "../../../../../types/interfaces/response/services/chatter/chat_cliamable.response";
import { TaskPriorityEnum } from "../../../../../types/interfaces/response/task/raider_task.response";

const ERROR_GETING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};

const ERROR_GETING_ALL_USER_CLIAMABLE_TASKS: ErrorInterface = {
  message: 'unable to fetch all users claimable tasks',
};

class ChatterUserTaskService {
  private _chatTaskModel: IChatTaskModelRepository;
  private _chatterTaskModel: IChatterTaskModelRepository;

  constructor (
    { chatTaskModel, chatterTaskModel } : {
      chatTaskModel: IChatTaskModelRepository;
      chatterTaskModel: IChatterTaskModelRepository;
    }){
      this._chatTaskModel = chatTaskModel;
      this._chatterTaskModel = chatterTaskModel;
  }

  public getAllActiveTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.getActiveTask({ level: TaskPriorityEnum.high }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getAllOtherTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.getActiveTask({ level: TaskPriorityEnum.low }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getAllOtherCliamableTask = async (taskId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatTaskDto }> => {
    const tasksResponse = await this._chatTaskModel.getAllTask({ taskId, taskStatus: TaskStatusStatus.PENDING }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getUserSingleTask = async ( taskId : string ) : Promise<{ errors?: ErrorInterface[]; task?: ChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };

    const chatResponse = await this._chatTaskModel.getAllTasks([{ taskId }]);

    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    if (!chatResponse.data) return { errors: [ERROR_GETING_ALL_USER_CLIAMABLE_TASKS] };

    tasksResponse.data.claimableTask = chatResponse.data;

    return { task: tasksResponse.data };
  }

  public getAvailableTaskPerDay = async (status: TaskStatusStatus, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: any }> => {
    const tasksResponse = await this._chatTaskModel.getAvailableTaskPerDay({taskStatus: status }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETING_ALL_USER_TASKS] };
    let tasks = []
    for (let i = 0; i < tasksResponse.data.chats.length; i++) {
      const chat = tasksResponse.data.chats[i];
      let chatTask = await this._chatterTaskModel.getChatTask({_id: chat.taskId})
      let allTask = {
        chat: chat,
        task: chatTask
      }
      tasks.push(allTask)
    }
    const result = {data: tasks, totalTask: tasksResponse.data.totalChats, hasNextPage: tasksResponse.data.hasNextPage}
    return { tasks: result };
  }
}

export default ChatterUserTaskService;