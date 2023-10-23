import { ISubSciptionStatus, ServiceAccountTypeEnum } from "../../interfaces/response/services/enums";
import { 
  IAnalytic,
  IMultipleRaiderUserService,
  IRaiderUserService,
} from "../../interfaces/response/services/raider.response";

export interface IUserServiceResponse {
  _id?: string;
  accountType: ServiceAccountTypeEnum;
  userId: string;
  updatedAt?: Date;
  createdAt?: Date;
  subscriptionStatus: ISubSciptionStatus;
  isVerified?: boolean;
  analytics: IAnalytic;
}

export interface IMultipleUserServiceResponse {
  userServices: IUserServiceResponse[];
  totalUserServices: number;
  hasNextPage: boolean;
}

class RaiderUserServiceDto implements IRaiderUserService {
  readonly _id?: string;
  accountType: ServiceAccountTypeEnum;
  userId: string;
  updatedAt?: Date;
  createdAt?: Date;
  subscriptionDate: number;
  isVerified?: boolean;
  work_timeout: number;
  analytics: IAnalytic;


  constructor (subUser: IRaiderUserService) {
    this._id = subUser._id;
    this.accountType = subUser.accountType;
    this.userId = subUser.userId;
    this.updatedAt = subUser.updatedAt;
    this.createdAt = subUser.createdAt;
    this.subscriptionDate = subUser.subscriptionDate;
    this.isVerified = subUser.isVerified;
    this.work_timeout = subUser.work_timeout;
    this.analytics = subUser.analytics;
  }

  get getDBModel() {
    return {
      accountType: this.accountType,
      userId: this.userId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      isVerified: this.isVerified,
      subscriptionDate: this.subscriptionDate,
      work_timeout: this.work_timeout,
      analytics: this.analytics
    } as IRaiderUserService
  }

  private get expirationDate() {
    console.log(this.subscriptionDate)
    const expirationDate = this.subscriptionDate + (1000 * 3600 * 24 * 30);
    console.log(expirationDate);
    return expirationDate;
  }

  get getResponse() {
    const currentTime = Date.parse((new Date()).toISOString())
    const subscriptionStatus = currentTime < this.expirationDate ? 'ACTIVE' : 'EXPIRED'

    return {
      id: this._id,
      accountType: this.accountType,
      userId: this.userId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      subscriptionStatus: subscriptionStatus,
      isVerified: this.isVerified,
      analytics: this.analytics
    } as IUserServiceResponse;
  }

  get isUserSubscribed() {
    const currentTime = Date.parse((new Date()).toISOString());
    return ( currentTime < this.expirationDate );
  }
}
export class MultipleUserServiceDto implements IMultipleRaiderUserService {
  userServices: RaiderUserServiceDto[];
  totalUserServices: number;
  hasNextPage: boolean;


  constructor (subUser: IMultipleRaiderUserService) {
    this.userServices = subUser.userServices.map((userService) => new RaiderUserServiceDto(userService));
    this.totalUserServices = subUser.totalUserServices;
    this.hasNextPage = subUser.hasNextPage;
  }

  get getResponse() {
    return {
      userServices: this.userServices.map((userService) => userService.getResponse ),
      totalUserServices: this.totalUserServices,
      hasNextPage: this.hasNextPage
    } as IMultipleUserServiceResponse;
  }
}

export default RaiderUserServiceDto;
