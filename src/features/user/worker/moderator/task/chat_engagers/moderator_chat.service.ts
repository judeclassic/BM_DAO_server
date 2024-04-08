import TransactionModel from "../../../../../../lib/modules/db/models/transaction.model";
import { ChatTaskDto, MultipleChatTaskDto } from "../../../../../../types/dtos/service/chats.dto";
import { ChatterTaskDto, MultipleChatterTaskDto } from "../../../../../../types/dtos/task/chatters.dto";
import { ModeratorTaskDto } from "../../../../../../types/dtos/task/moderator.dto";
import { AmountEnum } from "../../../../../../types/dtos/user.dto";
import ErrorInterface from "../../../../../../types/interfaces/error";
import IUserModelRepository from "../../../../../../types/interfaces/modules/db/models/Iuser.model";
import IChatTaskModelRepository from "../../../../../../types/interfaces/modules/db/models/service/chat.model";
import IChatterServiceModelRepository from "../../../../../../types/interfaces/modules/db/models/service/chatter.model";
import IModeratorServiceModelRepository from "../../../../../../types/interfaces/modules/db/models/service/moderator.model";
import IChatterTaskModelRepository from "../../../../../../types/interfaces/modules/db/models/task/Ichatter.model";
import { TaskStatusStatus } from "../../../../../../types/interfaces/response/services/chatter/chat_cliamable.response";
import { ServiceAccountTypeEnum } from "../../../../../../types/interfaces/response/services/enums";
import { TaskPriorityEnum } from "../../../../../../types/interfaces/response/task/chatter_task.response";
import { TransactionStatusEnum, TransactionTypeEnum } from "../../../../../../types/interfaces/response/transaction.response";


const ERROR_GETTING_ALL_USER_TASKS: ErrorInterface = {
  message: 'unable to fetch all users tasks',
};

const ERROR_GETTING_THIS_USER_SERVICE: ErrorInterface = {
  message: 'error getting the Chatter service and social handles',
};

const ERROR_GETTING_THIS_TASK: ErrorInterface = {
  message: 'Error fetching this task',
};

const ERROR_GETTING_THIS_Chat: ErrorInterface = {
  message: 'Error fetching this Chat',
};

class ModeratorUserTaskService {
  private _chatModel: IChatTaskModelRepository;
  private _userModel: IUserModelRepository;
  private _chatterTaskModel: IChatterTaskModelRepository;
  private _chatterServiceModel: IChatterServiceModelRepository;
  private _moderatorServiceModel: IModeratorServiceModelRepository;
  private _transactionModel: TransactionModel;

  constructor (
    { chatterTaskModel, chatModel, moderatorServiceModel, chatterServiceModel, userModel, transactionModel } : {
      chatModel: IChatTaskModelRepository;
      chatterTaskModel: IChatterTaskModelRepository;
      chatterServiceModel: IChatterServiceModelRepository;
      moderatorServiceModel: IModeratorServiceModelRepository;
      userModel: IUserModelRepository;
      transactionModel: TransactionModel;
    }){
      this._chatModel = chatModel;
      this._chatterTaskModel = chatterTaskModel;
      this._moderatorServiceModel = moderatorServiceModel;
      this._chatterServiceModel = chatterServiceModel;
      this._userModel = userModel;
      this._transactionModel = transactionModel;
  }

  public getAllOtherTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.getActiveTask({ level: TaskPriorityEnum.low }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getAllModeratorTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.getActiveTask({ moderatorId: userId, level: TaskPriorityEnum.high }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getAllModeratorOtherTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.getActiveTask({ moderatorId: userId, level: TaskPriorityEnum.low }, option);
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    return { tasks: tasksResponse.data };
  }

  public getSingleTask = async (taskId: string) : Promise<{ errors?: ErrorInterface[]; task?: ChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    return { task: tasksResponse.data };
  }

  public getChatterSingleChat = async (ChatId: string) : Promise<{ errors?: ErrorInterface[]; Chat?: ChatTaskDto }> => {
    const ChatsResponse = await this._chatModel.checkIfExist({ _id: ChatId });
    if (!ChatsResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };  

    const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: ChatsResponse.data.taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    const ChatterService = await this._chatterServiceModel.checkIfExist({ _id: ChatsResponse.data.serviceId });
    if (!ChatterService.data) return { errors: [ERROR_GETTING_THIS_USER_SERVICE] };

    ChatsResponse.data.addTaskToModel = tasksResponse.data;
    ChatsResponse.data.addServiceToModel = ChatterService.data;

    return { Chat: ChatsResponse.data };
  }

  public getModeratorChattersChat = async ( taskId: string, option : { limit: number; page: number, status: TaskStatusStatus }) : Promise<{ errors?: ErrorInterface[]; Chats?: MultipleChatTaskDto }> => {
    if (option.status) {
      const ChatsResponse = await this._chatModel.getAllTask({ taskId, taskStatus: option.status }, option);
      if (!ChatsResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
      return { Chats: ChatsResponse.data };
    }
    const ChatsResponse = await this._chatModel.getAllTask({ taskId }, option);
    if (!ChatsResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    return { Chats: ChatsResponse.data };
  }

  public rejectChat = async ( userId: string, ChatId: string ) : Promise<{ errors?: ErrorInterface[]; Chat?: ChatTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.checkIfExist({ moderatorId: userId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    const ChatResponse = await this._chatModel.checkIfExist({ _id: ChatId })
    if (!ChatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    if (ChatResponse.data.taskId === tasksResponse.data.id) return { errors: [ERROR_GETTING_THIS_Chat] };
    if (ChatResponse.data.taskStatus === TaskStatusStatus.APPROVED) return { errors: [{message: 'this Chat has been approved already'}] };
    if (ChatResponse.data.taskStatus === TaskStatusStatus.REJECTED) return { errors: [{message: 'this Chat has been rejected already'}] };

    if (ChatResponse.data.taskId === tasksResponse.data.id) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    tasksResponse.data.modifyUserChattersNumber('remove');

    const updatedChatResponse = await this._chatModel.updateTask(ChatId, { taskStatus: TaskStatusStatus.REJECTED })
    if (!updatedChatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(ChatResponse.data.taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    updatedChatResponse.data.addTaskToModel = updatedTaskResponse.data;
    updatedChatResponse.data.assigneeId &&
      this._chatterServiceModel.updateCancelAnalytics(updatedChatResponse.data.assigneeId);

    return { Chat: updatedChatResponse.data }
  }

  public approveChat = async ( userId: string, ChatId: string ) : Promise<{ errors?: ErrorInterface[]; Chat?: ChatTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.checkIfExist({ moderatorId: userId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    const ChatResponse = await this._chatModel.checkIfExist({ _id: ChatId })
    if (!ChatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    if (ChatResponse.data.taskId === tasksResponse.data.id) return { errors: [ERROR_GETTING_THIS_Chat] };
    if (ChatResponse.data.taskStatus !== TaskStatusStatus.COMPLETED) return { errors: [{message: 'this Chat has been completed'}] };
  
    const updatedChatResponse = await this._chatModel.updateTask(ChatId, { taskStatus: TaskStatusStatus.APPROVED })
    if (!updatedChatResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    updatedChatResponse.data.addTaskToModel = tasksResponse.data

    updatedChatResponse.data.assigneeId && 
    await Promise.all([
      this._userModel.updateBalance(updatedChatResponse.data.assigneeId, ChatterTaskDto.getPayoutPay()),
      this._transactionModel.saveTransaction({
        name: TransactionTypeEnum.CHATTER_SUBSCRIPTION,
        userId: ChatResponse.data.assigneeId,
        updatedAt: new Date(),
        createdAt: new Date(),
        transactionType: TransactionTypeEnum.CHATTER_SUBSCRIPTION,
        transactionStatus: TransactionStatusEnum.COMPLETED,
        amount: ChatterTaskDto.getPayoutPay(),
        isVerified: true,
      })
    ]);

    return { Chat: updatedChatResponse.data }
  }

  public approveTaskAsComplete = async ( userId: string, taskId: string ) : Promise<{ errors?: ErrorInterface[]; task?: ChatterTaskDto }> => {
    const tasksResponse = await this._chatterTaskModel.checkIfExist({_id: taskId });
    if (!tasksResponse.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
    if (!updatedTaskResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };
    await this._userModel.updateCompletedAnalytics(tasksResponse.data.userId, ServiceAccountTypeEnum.chatter);

    const ChatsResponse = await this._chatModel.getAllTasks([{ taskId, taskStatus: TaskStatusStatus.STARTED }]);
    if (!ChatsResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

    Promise.all(ChatsResponse.data.map((Chat) => {
      if (!Chat.assigneeId) return;
      this._userModel.updateBalance(Chat.assigneeId, ChatterTaskDto.getPayoutPay());
      this._transactionModel.saveTransaction({
        name: TransactionTypeEnum.CHATTER_SUBSCRIPTION,
        userId: Chat.assigneeId,
        updatedAt: new Date(),
        createdAt: new Date(),
        transactionType: TransactionTypeEnum.CHATTER_SUBSCRIPTION,
        transactionStatus: TransactionStatusEnum.COMPLETED,
        amount: (ChatterTaskDto.getPayoutPay()),
        isVerified: true,
      });
    }));
    this._moderatorServiceModel.updateCompletedAnalytics(userId);
    const user = await this._userModel.updateCompletedAnalytics(userId, ServiceAccountTypeEnum.chatter);
    if (!user.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    user.data.updateUserWithdrawableBalance({
      amount: AmountEnum.moderatorChatterPay,
      type: 'paid'
    });

    const updatedUser = await this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
    if (!updatedUser.data) return { errors: [ERROR_GETTING_THIS_TASK] };

    await this._chatModel.deleteAllTask({ taskId });

    return { task: updatedTaskResponse.data }
  }

  // public getAllActiveTask = async (userId: string, option : { limit: number; page: number}) : Promise<{ errors?: ErrorInterface[]; tasks?: MultipleChatterTaskDto }> => {
  //   const tasksResponse = await this._chatterTaskModel.getActiveTask({ level: TaskPriorityEnum.high, isModerated: false }, option);
  //   if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

  //   return { tasks: tasksResponse.data };
  // }

  // public getModeratorTask = async (taskId: string) : Promise<{ errors?: ErrorInterface[]; task?: ChatterTaskDto }> => {
  //   const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: taskId });
  //   if (!tasksResponse.data) return { errors: [ERROR_GETTING_ALL_USER_TASKS] };

  //   return { task: tasksResponse.data };
  // }

  // public moderateTask = async (userId: string, taskId: string, serviceId: string ) : Promise<{ errors?: ErrorInterface[]; task?: ChatterTaskDto }> => {
  //   const userService = await this._moderatorServiceModel.checkIfExist({ _id: serviceId });
  //   if (!userService.data) return { errors: [ERROR_THIS_USER_HAVE_NOT_SUBSCRIBE] };

  //   const tasksResponse = await this._chatterTaskModel.checkIfExist({ _id: taskId });
  //   if (!tasksResponse.data) return { errors: [ERROR_UNABLE_TO_GET_TASK] };

  //   if ( userService.data.userId !== userId ) return { errors: [ERROR_SERVICE_DO_NOT_BELONG_TO_THIS_USER] };
  //   if ( !userService.data.isUserSubscribed ) return { errors: [ERROR_USER_IS_NOT_A_CLIENT] };

  //   if ( tasksResponse.data.moderatorId === userId ) return { errors: [ERROR_THIS_TASK_IS_ALREADY_MODERATED_BY_YOU] }
  //   if ( tasksResponse.data.isModerated ) return { errors: [ERROR_THIS_TASK_HAS_A_MODERATOR_ALREADY] }

  //   tasksResponse.data.addModerator = userService.data;
  //   const updatedTaskResponse = await this._chatterTaskModel.updateTaskDetailToDB(taskId, tasksResponse.data.getDBModel);
  //   this._chatterServiceModel.updateCreatedAnalytics(userId);

  //   return { task: updatedTaskResponse.data }
  // }
}

export default ModeratorUserTaskService;
