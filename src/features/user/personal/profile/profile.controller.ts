import AutheticatedUserInterface from "../../../../types/interfaces/requests/user/authencated-user";
import { IUpdateUserRequest } from "../../../../types/interfaces/requests/user/update-user";
import ResponseInterface from "../../../../types/interfaces/response/response";
import UserProfileService from "./profile.service";
import UserProfileValidator from "./profile.validator";

class UserProfileController {
    private _userService: UserProfileService;
    private _userValidator: UserProfileValidator;

    constructor({ userService, userValidator }:{ userService: UserProfileService, userValidator: UserProfileValidator }) {
        this._userService = userService;
        this._userValidator = userValidator;
    }

    public getUser = async ({ params }: { params: any}, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
      const { userId } = params;
      if (!userId) {
        return sendJson(403, {
          code: 403,
          status: false,
        });
      }
  
      const foundUser = await this._userService.findUserById(userId);
      if (foundUser === null) {
        return sendJson(401, {
          error: [{message: 'User is not found'}],
          status: false,
          code: 401
        });
      }
  
      return sendJson(200, {
          status: true,
          code: 200,
          data: foundUser.getUnSecureResponse
      });
  }
    
    public viewProfile = async ({ user }: { user: any }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
        if (!user.id) return sendJson(403, { code: 403, status: false });
    
        const foundUser = await this._userService.findUserById(user.id);
        if (!foundUser) return sendJson(401, { error: [{message: 'User is not found'}], status: false, code: 401 });
    
        return sendJson(200, { status: true, code: 200, data: foundUser.getResponse });
    }

    public getUserReferals = async ({ user, params }: { user: any, params: any }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
        if (!user.id) return sendJson(403, { code: 403, status: false });
    
        const foundUser = await this._userService.getUserReferals(user.id, params.level);
        if (!foundUser.data) return sendJson(401, { error: [{message: 'User is not found'}], status: false, code: 401 });
    
        return sendJson(200, { status: true, code: 200, data: foundUser.data.getResponse });
    }

    public updateProfile = async ({ user, body }: { user: AutheticatedUserInterface, body: IUpdateUserRequest }, sendJson: (code: number, response: ResponseInterface<any>)=>void)  => {
      const validationErrors = this._userValidator.validateBeforePersonalUpdate({ ...body });
      if (validationErrors.length > 0) {
        return sendJson(400, {
          error: validationErrors,
          code: 400,
          status: false
        });
      }

        const { id } = user;
        if (!id) {
          return sendJson(403, {
            code: 403,
            status: false,
          });
        }
        const { name, phoneNumber, country } = body;
    
        const foundUser = await this._userService.updateProfileInformation(id, { name, phoneNumber, country });
        if (!foundUser.user) {
          return sendJson(401, {
            error: [{message: 'User is not found'}],
            status: false,
            code: 401
          });
        }
    
        return sendJson(200, {
            status: true,
            code: 200,
            data: foundUser.user.getResponse
        });
    }
}

export default UserProfileController;