import { IRaidResponse, IMultipleRaidResponse } from "../../../../../../types/dtos/service/raids.dto";
import { IMultipleRaiderTaskResponse, IRaiderTaskResponse } from "../../../../../../types/dtos/task/raiders.dto";
import AutheticatedUserInterface from "../../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../../types/interfaces/response/response";
import ModeratorUserTaskService from "./moderator.service";
import ModeratorTaskValidator from "./moderator.validator";


class ModeratorUserRaidController {
    private _taskValidator: ModeratorTaskValidator;
    private _moderatorUserTaskService: ModeratorUserTaskService; 
    
    constructor({taskValidator, moderatorUserTaskService} : {
      taskValidator: ModeratorTaskValidator;
      moderatorUserTaskService: ModeratorUserTaskService;
    }) {
        this._taskValidator = taskValidator;
        this._moderatorUserTaskService = moderatorUserTaskService;
    }
    
    public getAllActiveTask = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getAllActiveTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getAllOtherTask = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=> void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getAllOtherTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public moderateTask = async (
      { body, user }: { body: { taskId: string; serviceId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.moderateTask(user.id, body.taskId, body.serviceId);
      if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    }

    public rejectRaid = async (
      { body, user }: { body: { raidId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IRaidResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.raidId);
      if (validationErrors.length > 0)  return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.rejectRaid(user.id, body.raidId );
      if ( !response.raid ) return sendJson(401, { error: response.errors, code: 401, status: false });
      
      sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
    }

    public approveTaskAsComplete = async (
      { body, user }: { body: { taskId: string }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.approveTaskAsComplete(user.id, body.taskId );
      if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
    
      sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    }

    public getAllModeratorsActiveTasks = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getAllModeratorTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });

      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getAllModeratorsTasks = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getAllModeratorOtherTask(user.id, query);
      if ( !response.tasks ) return sendJson(401, { error: response.errors, code: 401, status: false });

      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getModeratorTask = async (
      { params, user }: { params: { taskId: string; }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IRaiderTaskResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getModeratorTask(params.taskId);
      if ( !response.task ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.task.getResponse, code: 201, status: true });
    }

    public getModeratedRaids = async (
      { params, query, user }: { params: { taskId: string; }, query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleRaidResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getModeratorRaidersRaid(params.taskId, query);
      if ( !response.raids ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.raids.getResponse, code: 201, status: true });
    }

    public getUserSingleRaid = async (
      { params, user }: { params: { taskId: string; }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IRaidResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.taskId);
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._moderatorUserTaskService.getRaiderSingleRaid(params.taskId);
      if ( !response.raid ) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
    }
}

export default ModeratorUserRaidController;