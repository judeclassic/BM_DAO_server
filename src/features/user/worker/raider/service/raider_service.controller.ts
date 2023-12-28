import { IMultipleUserServiceResponse, IUserServiceResponse } from "../../../../../types/dtos/service/raiders.dto";
import AutheticatedUserInterface from "../../../../../types/interfaces/requests/user/authencated-user";
import ResponseInterface from "../../../../../types/interfaces/response/response";
import RaiderUserServiceService from "./raider_service.service";
import RaiderServiceValidator from "./raider_service.validator";

class RaiderUserServiceController {
    private _raiderServiceService: RaiderUserServiceService;
    private _raiderServiceValidator: RaiderServiceValidator;

    constructor({ raiderServiceService, raiderServiceValidator } : { 
      raiderServiceService: RaiderUserServiceService;
      raiderServiceValidator: RaiderServiceValidator;
    }) {
        this._raiderServiceService = raiderServiceService;
        this._raiderServiceValidator = raiderServiceValidator;
    }

    public subscribeUserService = async ({ body, user }:{ body: any, user: AutheticatedUserInterface }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
        const validationErrors = this._raiderServiceValidator.validateServiceBeforeCreation(body);
        if (validationErrors.length > 0) {
          return sendJson(400, {
            error: validationErrors,
            code: 400,
            status: false
          });
        }
    
        const { accountType, handles } = body;
        const response = await this._raiderServiceService.subscribeForAService({ accountType, userId: user.id, handles });
    
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
        const validationErrors = this._raiderServiceValidator.validateServiceBeforeReSubscribing(body);
        if (validationErrors.length > 0) {
          return sendJson(400, {
            error: validationErrors,
            code: 400,
            status: false
          });
        }
    
        const { userServiceId } = body;
        const response = await this._raiderServiceService.resubscribeAService({ userServiceId, userId: user.id });
    
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


    public listAllUserServices = async ({ user, query }: { user: AutheticatedUserInterface, query: any },
      sendJson: (code: number, response: ResponseInterface<IMultipleUserServiceResponse>
    ) => void)  => {
      const { page, limit } = query;

      const response = await this._raiderServiceService.listAllUserServices(user.id, { page, limit });

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

    public getUserService = async ({ user }: { user: AutheticatedUserInterface, query: any },
      sendJson: (code: number, response: ResponseInterface<IUserServiceResponse>
    ) => void)  => {

      const response = await this._raiderServiceService.getUserService(user.id);

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
  
      const response = await this._raiderServiceService.unsubscribeFromUserService(user.id, requestId, password);

      if ( !response.userService ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.userService.getResponse,
        code: 201,
        status: true
      });
    }

    public updateSocialHandle = async ({ user, body }:{
      user: AutheticatedUserInterface,
      body: any 
    }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
      const { serviceId, handles } = body;
  
      const response = await this._raiderServiceService.updateSocialHandle(user.id, serviceId, handles);

      if ( !response.userService ) return sendJson(401, {
        error: response.errors,
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: response.userService.getResponse,
        code: 201,
        status: true
      });
    }
    
}

export default RaiderUserServiceController;