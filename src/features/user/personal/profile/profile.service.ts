import RaiderUserServiceModel from "../../../../lib/modules/db/models/service/raider.model";
import { ERROR_INSUFFICIENT_PERMISSIONS } from "../../../../types/constants/errors";
import UserDto, { UnSecureUserResponseInterface, UserResponseInterface } from "../../../../types/dtos/user.dto";
import ErrorInterface from "../../../../types/interfaces/error";
import AuthorizationInterface, { TokenType } from "../../../../types/interfaces/modules/auth";
import UserModelInterface from "../../../../types/interfaces/modules/db/models/Iuser.model";
import MailerRepoInterface from "../../../../types/interfaces/modules/mailer";
import { IUpdateUserRequest } from "../../../../types/interfaces/requests/user/update-user";

const ERROR_USER_NOT_FOUND: ErrorInterface = {
  field: 'password',
  message: 'User with this email/password combination does not exist.',
};

class UserProfileService {
  private _userModel: UserModelInterface;
  private _raiderUserServiceModel: RaiderUserServiceModel;

  constructor ({ userModel, raiderUserServiceModel } : {
    userModel: UserModelInterface;
    raiderUserServiceModel: RaiderUserServiceModel;
  }){
    this._userModel = userModel;
    this._raiderUserServiceModel = raiderUserServiceModel;
  }

  public updateProfileInformation = async (userId: string, { name, phoneNumber, country }: IUpdateUserRequest): Promise<{
    errors?: ErrorInterface[];
    user?: UserDto;
  }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });
    if (user.error || !user.data ) return {errors: [ERROR_USER_NOT_FOUND]};
    
    const finalUser = await this._userModel.updateUserDetailToDB(user.data.id!, {
      name: name ?? user.data.name,
      phoneNumber: phoneNumber ?? user.data.phoneNumber,
      country: country ?? user.data.country,
      updatedAt: new Date()
    });

    if (finalUser.error || !finalUser.data ) return {errors: [ERROR_INSUFFICIENT_PERMISSIONS]};
    const raiderService = await this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
    finalUser.data.raiderService = raiderService.data;

    return { user: finalUser.data }
  };

  public findUserById = async (userId: string): Promise<UserDto | null> => {
    const user = await this._userModel.checkIfExist({ _id: userId });

    if ( user.error || !user.data ) return null;
    
    const raiderService = await this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
    user.data.raiderService = raiderService.data;

    return user.data;
  };

  public getUserReferals = async (userId: string, level: '1' | '2' | '3'): Promise<{data?: UserDto; errors?: ErrorInterface[]}> => {
    const user = await this._userModel.checkIfExist({ _id: userId });

    if (user.error || !user.data ) return {errors: [ERROR_USER_NOT_FOUND]};
    
    const raiderService = await this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
    user.data.raiderService = raiderService.data;
    user.data.referals = (await this.getReferalInfo(level, user.data.referal))?.data;

    return { data: user.data };
  };

  private getReferalInfo = async (level: '1' | '2' | '3', referal?: {
    referalCode1?: string | undefined;
    referalCode2?: string | undefined;
    referalCode3?: string | undefined;
}) => {
    if (level === '1') {
      const userWith1stReferalExists = await this._userModel.getReferals({ referalCode1: referal?.referalCode1 });
      return userWith1stReferalExists;
    }
    if (level === '2') {
      const userWith1stReferalExists = await this._userModel.getReferals({ referalCode2: referal?.referalCode2 });
      return userWith1stReferalExists;
    }
    if (level === '3') {
      const userWith1stReferalExists = await this._userModel.getReferals({ referalCode3: referal?.referalCode3 });
      return userWith1stReferalExists;
    }
  }
}
export default UserProfileService;
