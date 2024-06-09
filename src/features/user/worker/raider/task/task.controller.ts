import { IRaidResponse, IMultipleRaidResponse } from "../../../../../types/dtos/service/raids.dto";
import { IMultipleRaiderTaskResponse, IRaiderTaskResponse } from "../../../../../types/dtos/task/raiders.dto";
import AutheticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import { TaskStatusStatus } from "../../../../../types/interfaces/response/services/raid.response";
import RaiderUserTaskService from "./task.service";
import RaidersTaskValidator from "./task.validator";


class UserRaidController {
    private _taskValidator: RaidersTaskValidator;
    private _raiderUserTaskService: RaiderUserTaskService;
    
    constructor({taskValidator, raiderTaskService} : {taskValidator: RaidersTaskValidator; raiderTaskService: RaiderUserTaskService;}) {
        this._taskValidator = taskValidator;
        this._raiderUserTaskService = raiderTaskService;
    }
    
    public getAllActiveTask = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getAllActiveTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getActiveTaskForDay = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getActiveTaskForDay(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getAllOtherTask = async (
      { query, user }: { query: { limit: number; page: number }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getAllOtherTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getSingleTask = async (
      { params, user }: { params: { taskId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IRaiderTaskResponse>)=> void
    )  => {
      console.log(params)
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getUserSingleTask(params.taskId);
      if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    }
}

export default UserRaidController;