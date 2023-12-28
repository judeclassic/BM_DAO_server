import { IModeratorServiceResponse, IMultipleModeratorServiceResponse } from "../../../../../types/dtos/service/moderators.dto";
import { IMultipleUserServiceResponse } from "../../../../../types/dtos/service/raiders.dto";
import AutheticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import ModeratorUserServiceService from "./moderator_service.service";
import UserServiceValidator from "./moderator_service.validator";


class ModeratorUserServiceController {
    private _userServiceService: ModeratorUserServiceService;
    private _userServiceValidator: UserServiceValidator;

    constructor({ userServiceService, userServiceValidator } : { 
      userServiceService: ModeratorUserServiceService;
      userServiceValidator: UserServiceValidator;
    }) {
        this._userServiceService = userServiceService;
        this._userServiceValidator = userServiceValidator;
    }

    public subscribeUserService = async ({ body, user }:{ body: any, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
        const validationErrors = this._userServiceValidator.validateServiceBeforeCreation(body);
        if (validationErrors.length > 0) {
          return sendJson(400, {
            error: validationErrors,
            code: 400,
            status: false
          });
        }
    
        const { accountType } = body;
        const response = await this._userServiceService.subscribeForAService({ accountType, userId: user.id });
    
        if ( !response.userService ) return sendJson(401, {
          error: response.errors,
          code: 401,
          status: false
        });
    
        if (response.userService === null) return sendJson(401, {
          code: 401,
          status: false
        });
    
        return sendJson(201, {
          data: response.userService.getResponse,
          code: 201,
          status: true
        });
    }

    public reSubscribeUserService = async ({ body, user }:{ body: any, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
        const validationErrors = this._userServiceValidator.validateServiceBeforeReSubscribing(body);
        if (validationErrors.length > 0) {
          return sendJson(400, {
            error: validationErrors,
            code: 400,
            status: false
          });
        }
    
        const { userServiceId } = body;
        const response = await this._userServiceService.resubscribeAService({ userServiceId, userId: user.id });
    
        if ( !response.userService ) return sendJson(401, {
          error: response.errors,
          code: 401,
          status: false
        });
    
        if (response.userService === null) return sendJson(401, {
          code: 401,
          status: false
        });
    
        return sendJson(201, {
          data: response.userService.getResponse ,
          code: 201,
          status: true
        });
    }

    public getUserService = async ({ user }: { user: AutheticatedUserInterface, query: any },
      sendJson: (code: number, response: ResponseInterface<IModeratorServiceResponse>
    ) => void)  => {

      const response = await this._userServiceService.getUserService(user.id);

      if ( !response.userService ) {
        return sendJson(401, {
          error: response.errors,
          code: 401,
          status: false
        });
      }
  
      return sendJson(200, {
        status: true,
        code: 200,
        data: response.userService.getResponse
      });
    }

    public listAllUserServices = async ({ user, query }: { user: AutheticatedUserInterface, query: any },
      sendJson: (code: number, response: ResponseInterface<IMultipleModeratorServiceResponse>
    ) => void)  => {
      const { page, limit } = query;

      const response = await this._userServiceService.listAllUserServices(user.id, { page, limit });

      if ( !response.userServices ) {
        return sendJson(401, {
          error: response.errors,
          code: 401,
          status: false
        });
      }
  
      return sendJson(200, {
        status: true,
        code: 200,
        data: response.userServices.getResponse
      });
    }

    public unSubscribeFromUserService = async ({ user, body }:{
      user: AutheticatedUserInterface,
      body: any 
    }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
      const { requestId, password } = body;
  
      const response = await this._userServiceService.unsubscribeFromUserService(user.id, requestId, password);

      if ( !response.userService ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.userService.getResponse ,
        code: 201,
        status: true
      });
    }
    
}

export default ModeratorUserServiceController;