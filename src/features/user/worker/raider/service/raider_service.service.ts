import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import RaiderUserServiceDto, { MultipleUserServiceDto } from "../../../../../types/dtos/service/raiders.dto";
import { AmountEnum, AmountPercentageEnum } from "../../../../../types/dtos/user.dto";
import ErrorInterface from "../../../../../types/interfaces/error";
import AuthorizationInterface from "../../../../../types/interfaces/modules/auth";
import IUserModelRepository from "../../../../../types/interfaces/modules/db/models/Iuser.model";
import IRaiderServiceModelRepository from "../../../../../types/interfaces/modules/db/models/service/raider.model";
import { ICreateUserServiceRequest } from "../../../../../types/interfaces/requests/user/create-user";
import { TransactionStatusEnum, TransactionTypeEnum } from "../../../../../types/interfaces/response/transaction.response";
import { AccountTypeEnum } from "../../../../../types/interfaces/response/user.response";

const ERROR_UNABLE_TO_REWARD_USER: ErrorInterface = {
  message: 'could not update user with referral',
};
const ERROR_USER_NOT_FOUND: ErrorInterface = {
  message: 'this user is not found.',
};

const ERROR_USER_DO_NOT_HAVE_THIS_SERVICE: ErrorInterface = {
  message: 'this user do not have this service.',
};
const ERROR_NOT_ENOUGH_BALANCE: ErrorInterface = {
  message: 'user do not have enough balance please recharge',
};
const ERROR_THIS_USERSERVICE_DO_NOT_EXIST: ErrorInterface = {
  message: 'user have not subscribed for this service',
};
const ERROR_THIS_USERSERVICE_DO_NOT_BELONG_TO_USER: ErrorInterface = {
  message: 'user do not own this service',
};
const ERROR_UNABLE_TO_CREATE_USER_SERVICE: ErrorInterface = {
  message: 'Unable to save user data on DB',
};
const ERROR_ALREADY_HAVE_THIS_ACCOUNT: ErrorInterface = {
  message: 'user have already suscribed the service',
};
const ERROR_THIS_USER_SUBSCRIPTION_IS_ACTIVE: ErrorInterface = {
  message: 'the subscription for this service has not expired',
};
const ERROR_USER_IS_A_CLIENT: ErrorInterface = {
  message: 'user is a client, unable to subscribe service',
};

class RaiderUserServiceService {
  private _transactionModel: TransactionModel;
  private _userServiceModel: IRaiderServiceModelRepository;
  private _userModel: IUserModelRepository;
  private _authRepo: AuthorizationInterface;

  constructor ({ authRepo, userModel, userServiceModel, transactionModel } : {
      transactionModel: TransactionModel;
      authRepo: AuthorizationInterface;
      userModel: IUserModelRepository;
      userServiceModel: IRaiderServiceModelRepository;
  }){
    this._authRepo = authRepo;
    this._userModel = userModel;
    this._userServiceModel = userServiceModel;
    this._transactionModel = transactionModel;
  }

  public subscribeForAService = async ({
    accountType,
    userId,
  } : ICreateUserServiceRequest): Promise<{ errors?: ErrorInterface[]; userService?: RaiderUserServiceDto }> => {
    console.log(userId);
    const user = await this._userModel.checkIfExist({ _id: userId });

    if (!user.data) return { errors: [ERROR_USER_NOT_FOUND] };

    if ( user.data?.accountType === AccountTypeEnum.client) return { errors: [ERROR_USER_IS_A_CLIENT] };

    const userServiceExists = await this._userServiceModel.checkIfExist({ userId, accountType });

    if ( userServiceExists.data ) return { errors: [ERROR_ALREADY_HAVE_THIS_ACCOUNT] };

    user.data.referal.isGiven = true;
    const isWithdrawed = user.data.updateUserWithdrawableBalance({ amount: AmountEnum.subscriptionPackage1, type: 'charged' });
    if (!isWithdrawed) return { errors: [ERROR_NOT_ENOUGH_BALANCE] };

    const userServiceRequest = {
        accountType: accountType,
        userId: userId,
        updatedAt: new Date(),
        createdAt: new Date(),
        subscriptionDate: Date.parse((new Date()).toISOString()),
        isVerified: false,
        work_timeout: Date.parse((new Date()).toISOString()),
        tasks: [],
        analytics: {
          availableTask: 0,
          pendingTask: 0,
          completedTask: 0,
        }
    }
    const userServiceResponse = await this._userServiceModel.createUserService(userServiceRequest);

    if ( !userServiceResponse.data ) return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] };

    const updatedUser = await this._userModel.updateUserDetailToDB( user.data.id!, user.data.getDBModel );
    if (!updatedUser.data) return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] }

    this._transactionModel.saveTransaction({
      name: updatedUser.data.name,
      userId: user.data.id,
      updatedAt: new Date(),
      createdAt: new Date(),
      transactionType: TransactionTypeEnum.RAIDER_SUBSCRIPTION,
      transactionStatus: TransactionStatusEnum.COMPLETED,
      amount: (AmountEnum.subscriptionPackage1),
      isVerified: true,
    });

    this.adwardReferals(updatedUser.data.referal);

    return { userService: userServiceResponse.data };
  };

  public resubscribeAService = async ({ userId, userServiceId } : {
    userServiceId: string, userId: string
  }) :Promise<{ errors?: ErrorInterface[]; userService?: RaiderUserServiceDto }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });

    if (!user.data) return { errors: [ERROR_USER_NOT_FOUND] };

    if ( user.data?.accountType === AccountTypeEnum.client) return { errors: [ERROR_USER_IS_A_CLIENT] };

    const userService = await this._userServiceModel.checkIfExist({ _id: userServiceId });

    if ( !userService.data ) return { errors: [ERROR_THIS_USERSERVICE_DO_NOT_EXIST] };

    if ( userService.data.isUserSubscribed ) return { errors: [ERROR_THIS_USER_SUBSCRIPTION_IS_ACTIVE] };

    if ( userService.data.userId !== userId ) return { errors: [ERROR_THIS_USERSERVICE_DO_NOT_BELONG_TO_USER] };

    const isWithdrawed = user.data.updateUserWithdrawableBalance({ amount: AmountEnum.subscriptionPackage1, type: 'charged' });
    if (!isWithdrawed) return { errors: [ERROR_NOT_ENOUGH_BALANCE] };

    const updatedUser = await this._userModel.updateUserDetailToDB( user.data.id!, user.data.getDBModel );
    if (!updatedUser.data) return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] };

    this._transactionModel.saveTransaction({
      name: updatedUser.data.name,
      userId: user.data.id,
      updatedAt: new Date(),
      createdAt: new Date(),
      transactionType: TransactionTypeEnum.RAIDER_SUBSCRIPTION,
      transactionStatus: TransactionStatusEnum.COMPLETED,
      amount: (AmountEnum.subscriptionPackage1),
      isVerified: true,
    });

    const updatedRaiderService = await this._userServiceModel.updateUserService(userService.data._id!, {
      subscriptionDate: Date.parse((new Date()).toISOString())
    });
    if ( !updatedRaiderService.data ) return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] };

    return { userService: updatedRaiderService.data };
  }

  public getUserService = async (userId: string): Promise<{
    errors?: ErrorInterface[];
    userServices?: RaiderUserServiceDto
  }> => {
    const userServices = await this._userServiceModel.checkIfExist({userId});
    if (userServices.error || !userServices.data ) return {errors: [ERROR_USER_DO_NOT_HAVE_THIS_SERVICE]};

    return { userServices: userServices.data };
  };

  public listAllUserServices = async (
    userId: string, { page, limit }:{ page: number, limit: number }
  ): Promise<{
    errors?: ErrorInterface[];
    userServices?: MultipleUserServiceDto
  }> => {
    const userServices = await this._userServiceModel.getAllUserService({userId}, { page, limit });
    if (userServices.error || !userServices.data ) return {errors: [ERROR_USER_NOT_FOUND]};

    return { userServices: userServices.data };
  };

  public unsubscribeFromUserService = async (userId: string, userServiceId: string, password: string) => {
    const userExists = await this._userModel.checkIfExist({ _id: userId });

    if ( !userExists.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    const passwordIsValid = this._authRepo.comparePassword(password, userExists.data.password);
    if (!passwordIsValid) return { errors: [ERROR_USER_NOT_FOUND] };

    const userService = await this._userServiceModel.deleteUserService(userServiceId);

    if ( !userService.data ) {
      return { errors: [ERROR_UNABLE_TO_CREATE_USER_SERVICE] }
    }

    return { userService: userService.data };
  }

  private adwardReferals = async (
    {referalCode1, referalCode2, referalCode3, isGiven}:
    {referalCode1?: string, referalCode2?: string, referalCode3?: string, isGiven: boolean}
  ) => {
    if (isGiven) return;

    const response1 = await this.adwardReferal(AmountPercentageEnum.referal1, 1, referalCode1);
    if (!response1.status) return response1;

    const response2 = await this.adwardReferal(AmountPercentageEnum.referal2, 2, referalCode2);
    if (!response2.status) return response2;

    const response3 = await this.adwardReferal(AmountPercentageEnum.referal3, 3, referalCode3);
    if (!response3.status) return response3;
  }

  private adwardReferal = async (percentage: AmountPercentageEnum, level: number, referalCode?: string) => {
    if (referalCode) {
      const userWith1stReferalExists = await this._userModel.checkIfReferalExist({ myReferalCode: referalCode });
      if (userWith1stReferalExists.data) {
        userWith1stReferalExists.data.updateReferalBalance({ amount: AmountEnum.subscriptionPackage1, percentage, level });
        const updateUserWith1stReferal = await this._userModel.updateUserDetailToDB(
          userWith1stReferalExists.data.id!, userWith1stReferalExists.data.getDBModel );
        if ( !updateUserWith1stReferal.data ) return { status: false, errors: [ERROR_UNABLE_TO_REWARD_USER] };
      }
    }
    return { status: true };
  }
}

export default RaiderUserServiceService;