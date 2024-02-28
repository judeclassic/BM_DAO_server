import { IChatResponse, IMultipleChatResponse } from "../../../../../types/dtos/service/chats.dto";
import AutheticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import RaiderUserTaskRaidService from "./work.service";
import RaidersTaskRaidValidator from "./work.validator";


class CliamableChatController {
    private _taskValidator: RaidersTaskRaidValidator;
    private _raiderUserTaskService: RaiderUserTaskRaidService;
    
    constructor({taskValidator, raiderTaskService} : {taskValidator: RaidersTaskRaidValidator; raiderTaskService: RaiderUserTaskRaidService;}) {
        this._taskValidator = taskValidator;
        this._raiderUserTaskService = raiderTaskService;
    }

    public startRaidTask = async ({ body, user }: { body: { taskId: string; serviceId: string }, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.startChatTask(user.id, body.taskId, body.serviceId);
      if ( !response.chat ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
  
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public completeRaidTask = async ({ body, user }: { body: { raidId: string, proofs: string[] }, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.raidId);
      if (validationErrors.length > 0) {
        return sendJson(400, { error: validationErrors, code: 400, status: false });
      }
  
      const response = await this._raiderUserTaskService.completeRaidTask(user.id, body.raidId, body.proofs );
      if ( !response.chat ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public cancelRaidTask = async ({ body, user }: { body: { raidId: string }, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.raidId);
      if (validationErrors.length > 0) {
        return sendJson(400, { error: validationErrors, code: 400, status: false });
      }
  
      const response = await this._raiderUserTaskService.cancelRaidTask(user.id, body.raidId );
      if ( !response.raid ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
    }

    public getAllUserRaid = async (
      { query, user }: { query: { limit: number; page: number}, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>) => void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getAllUsersRaids(user.id, query);
      if ( !response.tasks ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getUserSingleRaid = async (
      { params, user }: { params: { raidId: string; }, user: AutheticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.raidId);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getUserSingleRaid(params.raidId);
  
      if ( !response.chat ) 
        return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public viewUserSingle = async ({ body, user }: { body: { taskId: string; serviceId: string }, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.taskId);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.startChatTask(user.id, body.taskId, body.serviceId);
      if ( !response.chat ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
  
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }
}

export default CliamableChatController;