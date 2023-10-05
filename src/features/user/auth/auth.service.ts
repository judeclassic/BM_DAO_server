import RaiderUserServiceModel from "../../../lib/modules/db/models/service/raider.model";
import { ERROR_INSUFFICIENT_PERMISSIONS } from "../../../types/constants/errors";
import UserDto from "../../../types/dtos/user.dto";
import EmailSubJectEnum from "../../../types/enums/email-subject-enum";
import ErrorInterface from "../../../types/interfaces/error";
import AuthorizationInterface, { TokenType } from "../../../types/interfaces/modules/auth";
import UserModelInterface from "../../../types/interfaces/modules/db/models/Iuser.model";
import MailerRepoInterface from "../../../types/interfaces/modules/mailer";
import LoginRequest from "../../../types/interfaces/requests/auth/login";
import { ICreateUserRequest } from "../../../types/interfaces/requests/user/create-user";
import { IUpdateUserRequest } from "../../../types/interfaces/requests/user/update-user";
import { IUser, IWallet } from "../../../types/interfaces/response/user.response";

const ERROR_USER_ALREADY_EXISTS_WITH_EMAIL: ErrorInterface = {
  field: 'emailAddress',
  message: 'A user with this email address already exists.',
};
const ERROR_NO_USER_WITH_REFERAL_CODE: ErrorInterface = {
  field: 'referalCode',
  message: 'no user with this referal code, check and try again',
};
const ERROR_USER_NOT_FOUND: ErrorInterface = {
  field: 'password',
  message: 'User with this email/password combination does not exist.',
};
const ERROR_UNABLE_TO_SAVE_USER: ErrorInterface = {
  message: 'Unable to save user data on DB',
};
const ERROR_NO_USER_WITH_THIS_REFCODE: ErrorInterface = {
  message: 'There is no user with this referal code',
};
const ERROR_RESET_PASSWORD_TOKEN_EXPIRED: ErrorInterface = {
  message: 'This token has expired. Please request a new password reset.',
};

class UserAuthService {
  private _mailRepo: MailerRepoInterface;
  private _authRepo: AuthorizationInterface;
  private _userModel: UserModelInterface;
  private _raiderUserServiceModel: RaiderUserServiceModel;

  constructor ({mailRepo, authRepo, userModel, raiderUserServiceModel } : {
    mailRepo: MailerRepoInterface;
    authRepo: AuthorizationInterface;
    userModel: UserModelInterface;
    raiderUserServiceModel: RaiderUserServiceModel;
  }){
    this._mailRepo = mailRepo;
    this._userModel = userModel;
    this._authRepo = authRepo;
    this._raiderUserServiceModel = raiderUserServiceModel;
  }

  public registerUser = async ({
    accountType,
    name,
    username,
    country,
    emailAddress,
    password,
    referalCode
  } : ICreateUserRequest): Promise<{ errors?: ErrorInterface[]; user?: UserDto }> => {
    const userWithEmailExists = await this._userModel.checkIfExist({ emailAddress });
    if ( userWithEmailExists.data ) {
      return { errors: [ERROR_USER_ALREADY_EXISTS_WITH_EMAIL] };
    }

    const referalCodes =  await this.getReferalInfo(referalCode);
    if (referalCodes?.errors) {
      return { errors: [ERROR_NO_USER_WITH_REFERAL_CODE] };
    }

    const myReferalCode = this._authRepo.generateCode(6);
    const hashedPassword = this._authRepo.encryptPassword(password);
    const wallet: IWallet = { balance: { referalBonus: 0, taskBalance: 0, walletBalance: 0, totalBalance: 0 }, };

    const request: IUser = {
      accountType,
      name,
      username,
      emailAddress,
      country,
      password: hashedPassword,
      referal: { myReferalCode, ...referalCodes.referalCodes, isGiven: false },
      wallet,
    };
    
    const user = await this._userModel.saveUserToDB(request);
    if ( !user.data ) return { errors: [ERROR_UNABLE_TO_SAVE_USER] };

    const accessToken = this._authRepo.encryptToken(user.data.getUserForToken, TokenType.accessToken);
    user.data.accessToken = accessToken;

    return { user: user.data };
  };

  public loginUser = async ({ emailAddress, password }: LoginRequest): Promise<{
    errors?: ErrorInterface[];
    user?: UserDto;
  }> => {
    const user = await this._userModel.checkIfExist({ emailAddress });
    if (user == null) return { errors: [ERROR_USER_NOT_FOUND] };

    if (user.error || !user.data) return { errors: [ERROR_USER_NOT_FOUND] };

    const passwordIsValid = this._authRepo.comparePassword(password, user.data.password);
    if (!passwordIsValid) return { errors: [ERROR_USER_NOT_FOUND] };

    const accessToken = this._authRepo.encryptToken(user.data.getUserForToken, TokenType.accessToken);

    user.data.accessToken = accessToken;

    const raiderService = await this._raiderUserServiceModel.checkIfExist({ userId: user.data.id });
    user.data.raiderService = raiderService.data;

    this._userModel.updateUserDetailToDB( user.data.id!, { accessToken });

    return { user: user.data };
  };

  public logoutUser = async (userId: string) => {
    this._userModel.updateUserDetailToDB(userId, { accessToken: undefined });
  };

  public resetPassword = async (emailAddress: string): Promise<ErrorInterface[] | undefined> => {

    const user = await this._userModel.checkIfExist({ emailAddress });
    if (user == null) return [ERROR_USER_NOT_FOUND];

    const code = this._authRepo.generateVerificationCode(6);
    await this._userModel.updateUserDetailToDB(user.data!.id!, { authenticationCode: code });

    await this._mailRepo.sendPasswordResetEmail(emailAddress, { name: user.data!.name, code, subject: EmailSubJectEnum.VERIFY_TO_CHANGE_PASSWORD });
  };

  public confirmResetPassword = async (
    code: string,
    password: string,
  ): Promise<ErrorInterface[] | null> => {
    try {
      const { emailAddress } = this._authRepo.decryptToken( code, TokenType.resetPassword );

      const user = await this._userModel.checkIfExist({ emailAddress, authenticationCode: code });
      if (user == null) return [ERROR_RESET_PASSWORD_TOKEN_EXPIRED];
      const newPassword = this._authRepo.encryptPassword(password)

      await this._userModel.updateUserDetailToDB(user.data?.id!, { password: newPassword, authenticationCode: undefined,});

      return null;
    } catch {
      return [ERROR_RESET_PASSWORD_TOKEN_EXPIRED];
    }
  };

  private getReferalInfo = async (referalCode?: string) => {
    const referalCodes: { referalCode1?: string, referalCode2?: string, referalCode3?: string } = {};

    if (referalCode) {
      const userWith1stReferalExists = await this._userModel.checkIfReferalExist({ myReferalCode: referalCode });
      if ( !userWith1stReferalExists.data ) return { status: false, errors: [ERROR_NO_USER_WITH_THIS_REFCODE] };
      referalCodes.referalCode1 = referalCode;

      const userWith2ndReferalExists = await this._userModel.checkIfReferalExist({ myReferalCode: userWith1stReferalExists.data.referal.referalCode1 });
      if (userWith2ndReferalExists.data) {
        referalCodes.referalCode2 = userWith1stReferalExists.data.referal.referalCode1;
      }

      const userWith3rdReferalExists = await this._userModel.checkIfReferalExist({ myReferalCode: userWith1stReferalExists.data.referal.referalCode2 });
      if (userWith3rdReferalExists.data) {
        referalCodes.referalCode3 = userWith1stReferalExists.data.referal.referalCode2;
      }
    }

    return { status: true, referalCodes };
  }
}
export default UserAuthService;
