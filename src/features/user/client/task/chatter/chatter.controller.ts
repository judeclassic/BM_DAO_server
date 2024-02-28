import { IChatterTaskResponse, IMultipleChatterTaskResponse } from "../../../../../types/dtos/task/chatters.dto";
import { ICreateChatterGigRequest } from "../../../../../types/interfaces/requests/task/chatter";
import AutheticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import RaiderClientTaskService from "./chatter.service";
import RaiderClientTaskValidator from "./chatter.validator";

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

    public createTask = async ({ body, user }: { body: ICreateChatterGigRequest, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatterTaskResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateBeforeTaskCreation({ ...body });
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
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=>void
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
      sendJson: (code: number, response: ResponseInterface<IMultipleChatterTaskResponse>)=>void
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
      sendJson: (code: number, response: ResponseInterface<IChatterTaskResponse>)=>void
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