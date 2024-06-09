import { IMultipleChatResponse } from "../../../../../types/dtos/service/chats.dto";
import { IChatterTaskResponse, IMultipleChatterTaskResponse } from "../../../../../types/dtos/task/chatters.dto";
import AutheticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import ChatterUserTaskService from "./task.service";
import ChattersTaskValidator from "./task.validator";

class ChatterUserController {
    private _taskValidator: ChattersTaskValidator;
    private _chatterTaskService: ChatterUserTaskService;
    
    constructor({taskValidator, chatterTaskService} : {taskValidator: ChattersTaskValidator; chatterTaskService: ChatterUserTaskService;}) {
        this._taskValidator = taskValidator;
        this._chatterTaskService = chatterTaskService;
    }
    
    public getAllActiveTask = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._chatterTaskService.getAllActiveTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getAllOtherTask = async (
      { query, user }: { query: { limit: number; page: number }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._chatterTaskService.getAllOtherTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getAllOtherCliamableTask = async (
      { query, user }: { query: { limit: number; page: number, taskId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._chatterTaskService.getAllOtherCliamableTask(query.taskId, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getSingleTask = async (
      { params, user }: { params: { taskId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatterTaskResponse>)=> void
    )  => {
      console.log(params)
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._chatterTaskService.getUserSingleTask(params.taskId);
      if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    }

    public getAvailableTaskPerDay = async (
      { query, user }: { query: { limit: number; page: number, status: any }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }

      const option = {
        limit: query.limit,
        page: query.page
      }
  
      const response = await this._chatterTaskService.getAvailableTaskPerDay(query.status, option);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks, code: 201, status: true });
    }
}

export default ChatterUserController;