import { UserResponseInterface } from "../../../types/dtos/user.dto";
import LoginRequest from "../../../types/interfaces/requests/auth/login";
import AutheticatedUserInterface from "../../../types/interfaces/requests/user/authencated-user";
import ConfirmResetPasswordRequest from "../../../types/interfaces/requests/user/confirm-reset-password";
import { ICreateUserRequest } from "../../../types/interfaces/requests/user/create-user";
import ResponseInterface from "../../../types/interfaces/response/response";
import UserAuthService from "./auth.service";
import UserAuthValidator from "./auth.validator";

class UserAuthController {
    private _userAuthService: UserAuthService;
    private _userAuthValidator: UserAuthValidator; 
    
    constructor({authValidator, userAuthService} : {authValidator: UserAuthValidator, userAuthService : UserAuthService}) {
        this._userAuthValidator = authValidator;
        this._userAuthService = userAuthService;
    }

    public registerUser = async ({body }: { body: ICreateUserRequest }, sendJson: (code: number, response: ResponseInterface<UserResponseInterface>)=>void)  => {
      const validationErrors = this._userAuthValidator.validateBeforeRegistration({ ...body });
      if (validationErrors.length > 0) {
        return sendJson(400, {
          error: validationErrors,
          code: 400,
          status: false
        });
      }
  
      const { name, emailAddress, username, password, country, accountType, referalCode } = body;
      const { user, errors } = await this._userAuthService.registerUser({ name, emailAddress, username, password, country, accountType, referalCode });
  
      if (errors && errors.length > 0) return sendJson(401, {
        error: errors,
        code: 401,
        status: false
      });
  
      if (user === null) return sendJson(401, {
        code: 401,
        status: false
      });
  
      return sendJson(201, {
        data: user!.getResponse,
        code: 201,
        status: true
      });
    }

    loginUser = async ({body}: {body: LoginRequest}, sendJson: (code: number, response: ResponseInterface<UserResponseInterface>)=>void)  => {
        const validationErrors = this._userAuthValidator.login({ ...body });
        if (validationErrors.length > 0) {
          return sendJson(403, {code: 403, status: false, error: validationErrors});
        }
  
        const { emailAddress, password } = body;
        const response = await this._userAuthService.loginUser({emailAddress, password});
  
        if (!response.user) return sendJson(403, {
          status: false,
          code: 403,
          error: response.errors
        });
  
        return sendJson(200, {
          status: true,
          code: 200,
          data: response.user.getResponse,
        });
    }

    public resetPassword =  async ({ body }: { body: any}, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
      const { email } = body
      const validationErrors = this._userAuthValidator.resetPassword({ ...body });
      if (validationErrors.length > 0)
        return sendJson(400, {
            status: false,
            code: 400,
            error: validationErrors
          });
  
      await this._userAuthService.resetPassword(email);
  
      return sendJson(201, {
          status: true,
          code: 201,
      });
    }

    public confirmResetPassword = async ({ body }: { body: any}, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
        const { emailAddress, code, password, confirmPassword } = body as ConfirmResetPasswordRequest;

        const validationErrors = this._userAuthValidator.confirmResetPassword({ emailAddress, code, password, confirmPassword });

        if (validationErrors.length > 0)
          return sendJson(400, {
              status: false,
              code: 400,
              error: validationErrors
          });
  
        const errors = await this._userAuthService.confirmResetPassword( code, password );
        if (errors != null) return sendJson(400, { status: false, code: 400, error: errors });
  
        return sendJson(201, {
            status: true,
            code: 201,
        });
    }

    public logout = async ({body, user }:{body: any, user: AutheticatedUserInterface }, sendJson: (code: any, response: ResponseInterface<any>)=>void) => {
        const { token } = body as { token?: string };
        if (token == null) return sendJson(401, {code: 401, status: false});
    
        await this._userAuthService.logoutUser(user.id);
    
        return sendJson(201, { code: 201, status: true })
      }
}

export default UserAuthController;


// how to validate email?