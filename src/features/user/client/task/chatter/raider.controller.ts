
import { IRaiderTaskResponse, IMultipleRaiderTaskResponse } from "../../../../../types/dtos/task/raiders.dto";
import { ICreateRaiderGigRequest, ICreateRaiderTaskRequest } from "../../../../../types/interfaces/requests/task/raider";
import AutheticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import RaiderClientTaskService from "./chatter.client.service";
import RaiderClientTaskValidator from "./raider.validator";

class ClientRaidController {
    private _taskValidator: RaiderClientTaskValidator;
    private _raiderClientTaskService: RaiderClientTaskService; 
    
    constructor({taskValidator, raiderTaskService} : {
      taskValidator: RaiderClientTaskValidator;
      raiderTaskService: RaiderClientTaskService;
    }) {
        this._taskValidator = taskValidator;
        this._raiderClientTaskService = raiderTaskService;
    }

    public createRaidTask = async ({ body, user }: { body: ICreateRaiderGigRequest, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IRaiderTaskResponse[]>)=>void)  => {
      const validationErrors = this._taskValidator.validateBeforeRaiderGigCreation({ ...body });
      if (validationErrors.length > 0) {
        return sendJson(400, {
          error: validationErrors,
          code: 400,
          status: false
        });
      }
  
      const response = await this._raiderClientTaskService.createRaidTask(user.id, body);
  
      if ( !response.tasks ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.tasks.map( (task) => task.getResponse),
        code: 201,
        status: true
      });
    }

    public createTask = async ({ body, user }: { body: ICreateRaiderTaskRequest, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IRaiderTaskResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateBeforeRaiderTaskCreation({ ...body });
      if (validationErrors.length > 0) {
        return sendJson(400, {
          error: validationErrors,
          code: 400,
          status: false
        });
      }
  
      const response = await this._raiderClientTaskService.createTask(user.id, body);
  
      if ( !response.task ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.task.getResponse,
        code: 201,
        status: true
      });
    }

    public getAllUserTask = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        return sendJson(400, {
          error: validationErrors,
          code: 400,
          status: false
        });
      }
  
      const response = await this._raiderClientTaskService.getAllUserTask(user.id, query);
  
      if ( !response.tasks ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.tasks.getResponse,
        code: 201,
        status: true
      });
    }

    public getActiveTasks = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        return sendJson(400, {
          error: validationErrors,
          code: 400,
          status: false
        });
      }
  
      const response = await this._raiderClientTaskService.getActiveTasks(user.id, query);
  
      if ( !response.tasks ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.tasks.getResponse,
        code: 201,
        status: true
      });
    }

    public getUserSingleTask = async (
      { params, user }: { params: { taskId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) {
        return sendJson(400, {
          error: validationErrors,
          code: 400,
          status: false
        });
      }
  
      const response = await this._raiderClientTaskService.getUserSingleTask(user.id, params.taskId);
  
      if ( !response.task ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.task.getResponse,
        code: 201,
        status: true
      });
    }
}

export default ClientRaidController;