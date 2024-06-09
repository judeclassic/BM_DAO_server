import { IChatResponse, IMultipleChatResponse } from "../../../../../types/dtos/service/chats.dto";
import AuthenticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import ChattererUserTaskChatterService from "./work.service";
import ChatterersTaskChatterValidator from "./work.validator";


class ClaimableChatController {
    private _taskValidator: ChatterersTaskChatterValidator;
    private _raiderUserTaskService: ChattererUserTaskChatterService;
    
    constructor({taskValidator, raiderTaskService} : {taskValidator: ChatterersTaskChatterValidator; raiderTaskService: ChattererUserTaskChatterService;}) {
        this._taskValidator = taskValidator;
        this._raiderUserTaskService = raiderTaskService;
    }

    public startChatterTask = async ({ body, user }: { body: { chatId: string; serviceId: string }, user: AuthenticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.chatId);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.startChatTask(user.id, body.chatId, body.serviceId);
      if ( !response.chat ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
  
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public completeChatterTask = async ({ body, user }: { body: { chatId: string, proofs: string[] }, user: AuthenticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateIdAndProof(body.chatId, body.proofs);
      if (validationErrors.length > 0) {
        return sendJson(400, { error: validationErrors, code: 400, status: false });
      }
  
      const response = await this._raiderUserTaskService.completeChatterTask(user.id, body.chatId, body.proofs );
      if ( !response.chat ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public cancelChatterTask = async ({ body, user }: { body: { raidId: string }, user: AuthenticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(body.raidId);
      if (validationErrors.length > 0) {
        return sendJson(400, { error: validationErrors, code: 400, status: false });
      }
  
      const response = await this._raiderUserTaskService.cancelChatterTask(user.id, body.raidId );
      if ( !response.raid ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.raid.getResponse, code: 201, status: true });
    }

    public getAllUserChatter = async (
      { query, user }: { query: { limit: number; page: number}, user: AuthenticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>) => void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getAllUsersChatters(user.id, query);
      if ( !response.tasks ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.tasks.getResponse, code: 201, status: true });
    }

    public getUserStatusChatters = async (
      { query, user }: { query: { limit: number; page: number, status: string}, user: AuthenticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>) => void
    )  => {
      const validationErrors = this._taskValidator.validateOptions(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }

      const option = {limit: query.limit, page: query.page}
  
      const response = await this._raiderUserTaskService.getUserStatusChatters(user.id, option, query.status);
      if ( !response.tasks ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.tasks, code: 201, status: true });
    }

    public getUserTotalStatusTask = async (
      { query, user }: { query: { status: string}, user: AuthenticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>) => void
    )  => {
      const response = await this._raiderUserTaskService.getUserTotalStatusTask(user.id, query.status);
      if ( !response.totalTask ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.totalTask, code: 201, status: true });
    }

    public getAllUserSingleChattersTask = async (
      { query, user }: { query: { chatId: string; status: string}, user: AuthenticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IMultipleChatResponse>) => void
    )  => {
      const validationErrors = this._taskValidator.validatequery(query);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getAllUserSingleChattersTask(user.id, query);
      if ( !response.task ) {
        sendJson(401, { error: response.errors, code: 401, status: false });
        return;
      }
      sendJson(201, { data: response.task, code: 201, status: true });
    }


    public getUserSingleChatter = async (
      { params, user }: { params: { raidId: string; }, user: AuthenticatedUserInterface },
      sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void
    )  => {
      const validationErrors = this._taskValidator.validateIdBeforeCreation(params.raidId);
      if (validationErrors.length > 0) {
        sendJson(400, { error: validationErrors, code: 400, status: false });
        return;
      }
  
      const response = await this._raiderUserTaskService.getUserSingleChatter(params.raidId);
  
      if ( !response.chat ) 
        return sendJson(401, { error: response.errors, code: 401, status: false });
  
      sendJson(201, { data: response.chat.getResponse, code: 201, status: true });
    }

    public viewUserSingle = async ({ body, user }: { body: { taskId: string; serviceId: string }, user: AuthenticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<IChatResponse>)=>void)  => {
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

export default ClaimableChatController;