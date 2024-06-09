import AutheticatedUserInterface from "../../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../../types/interfaces/response/response";
import ModeratorUserTaskService from "./moderator_chat.service";
import ModeratorTaskValidator from "./moderator.validator";
import { IChatterTaskResponse, IMultipleChatterTaskResponse } from "../../../../../../types/dtos/task/chatters.dto";
import { IChatResponse, IMultipleChatResponse } from "../../../../../../types/dtos/service/chats.dto";
import { TaskStatusStatus } from "../../../../../../types/interfaces/response/services/chatter/chat_cliamable.response";


class ModeratorUserChatController {
    private _taskValidator: ModeratorTaskValidator;
    private _moderatorUserTaskService: ModeratorUserTaskService; 
    
    constructor({taskValidator, moderatorUserTaskService} : {
      taskValidator: ModeratorTaskValidator;
      moderatorUserTaskService: ModeratorUserTaskService;
    }) {
        this._taskValidator = taskValidator;
        this._moderatorUserTaskService = moderatorUserTaskService;
    }

    public getAllOtherTask = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getAllOtherTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getAllTaskByStatus = async (
      { query, user }: { query: { limit: number; page: number, status: any}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
      
      const option = {
        limit: query.limit,
        page: query.page
      }
      const response = await this._moderatorUserTaskService.getAllTaskByStatus(user.id, query.status, option);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks, code: 201, status: true });
    }

    public getModeratorChatTask = async (
      { user }: { user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=> void
    )  => {
      const response = await this._moderatorUserTaskService.getModeratorChatTask(user.id);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks, code: 201, status: true });
    }

    public getSingleTask = async (
      { params, user }: { params: { taskId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatterTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getSingleTask(params.taskId);
      if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    }

    public rejectChat = async (
      { body, user }: { body: { chatId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.chatId);
      if (validationErrors.length > 0)  return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.rejectChat(user.id, body.chatId );
      if ( !response.chat ) return sendJson(401, { error: response.errors, code: 401, status: false });
      
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public approveChat = async (
      { body, user }: { body: { chatId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.chatId);
      if (validationErrors.length > 0)  return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.approveChat(user.id, body.chatId );
      if ( !response.chat ) return sendJson(401, { error: response.errors, code: 401, status: false });
      
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public approveTaskAsComplete = async (
      { body, user }: { body: { taskId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatterTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.approveTaskAsComplete(user.id, body.taskId );
      if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
    
      sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    }

    public getAllModeratorsActiveTasks = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getAllModeratorTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });

      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getAllModeratorsTasks = async (
      { query, user }: { query: { limit: number; page: number }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getAllModeratorOtherTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });

      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getModeratedChats = async (
      { params, query, user }: { params: { taskId: string; }, query: { limit: number; page: number, status: TaskStatusStatus }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getModeratorChattersChat(params.taskId, query);
      if ( !response.chats ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.chats.getResponse, code: 201, status: true });
    }

    public getUserSingleChat = async (
      { params, user }: { params: { chatId: string; }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.chatId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getChatterSingleChat(params.chatId);
      if ( !response.chat ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    // public getAllActiveTask = async (
    //   { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
    //   sendJson: (code: number, response: ResponseInterface<IMultipleChaterTaskResponse>)=> void
    // )  => {
    //   const validationErrors = this._taskValidator.validateOptions(query);
    //   if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
    //   const response = await this._moderatorUserTaskService.getAllActiveTask(user.id, query);
    //   if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
    //   sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    // }

    // public getModeratorTask = async (
    //   { params, user }: { params: { taskId: string; }, user: AutheticatedUserInterface },
    //   sendJson: (code: number, response: ResponseInterface<IChaterTaskResponse>)=>void
    // )  => {
    //   const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
    //   if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
    //   const response = await this._moderatorUserTaskService.getModeratorTask(params.taskId);
    //   if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
    //   sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    // }

    // public moderateTask = async (
    //   { body, user }: { body: { taskId: string; serviceId: string }, user: AutheticatedUserInterface },
    //   sendJson: (code: number, response: ResponseInterface<IChaterTaskResponse>)=>void
    // )  => {
    //   const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
    //   if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
    //   const response = await this._moderatorUserTaskService.moderateTask(user.id, body.taskId, body.serviceId);
    //   if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
    //   sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    // }
}

export default ModeratorUserChatController;