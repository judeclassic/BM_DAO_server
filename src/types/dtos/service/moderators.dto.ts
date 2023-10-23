import { ISubSciptionStatus, ServiceAccountTypeEnum } from "../../interfaces/response/services/enums";
import { IModeratorUserService, IMultipleModeratorUserService } from "../../interfaces/response/services/moderator.response";
import { IAnalytic } from "../../interfaces/response/services/raider.response";

export interface IModeratorServiceResponse {
  _id?: string;
  accountType: ServiceAccountTypeEnum;
  userId: string;
  updatedAt?: Date;
  createdAt?: Date;
  subscriptionStatus: ISubSciptionStatus;
  isVerified?: boolean;
  analytics: IAnalytic;
}

export interface IMultipleModeratorServiceResponse {
  userServices: IModeratorServiceResponse[];
  totalUserServices: number;
  hasNextPage: boolean;
}

class ModeratorUserServiceDto implements IModeratorUserService {
  _id?: string;
  name: string;
  accountType: ServiceAccountTypeEnum;
  userId: string;
  updatedAt?: Date;
  createdAt?: Date;
  subscriptionDate: number;
  isVerified?: boolean;
  work_timeout: number;
  analytics: IAnalytic;


  constructor (subUser: IModeratorUserService) {
    this._id = subUser._id;
    this.name = subUser.name;
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
      name: this.name,
      userId: this.userId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      isVerified: this.isVerified,
      subscriptionDate: this.subscriptionDate,
      work_timeout: this.work_timeout,
      analytics: this.analytics
    } as IModeratorUserService
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
      name: this.name,
      accountType: this.accountType,
      userId: this.userId,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      subscriptionStatus: subscriptionStatus,
      isVerified: this.isVerified,
      analytics: this.analytics
    } as IModeratorServiceResponse;
  }

  get isUserSubscribed() {
    const currentTime = Date.parse((new Date()).toISOString());
    return ( currentTime < this.expirationDate );
  }
}
export class MultipleModeratorServiceDto implements IMultipleModeratorUserService {
  moderatorServices: ModeratorUserServiceDto[];
  totalModeratorServices: number;
  hasNextPage: boolean;


  constructor (subUser: IMultipleModeratorUserService) {
    this.moderatorServices = subUser.moderatorServices.map((userService) => new ModeratorUserServiceDto(userService));
    this.totalModeratorServices = subUser.totalModeratorServices;
    this.hasNextPage = subUser.hasNextPage;
  }

  get getResponse() {
    return {
      userServices: this.moderatorServices.map((userService) => userService.getResponse ),
      totalUserServices: this.totalModeratorServices,
      hasNextPage: this.hasNextPage
    } as IMultipleModeratorServiceResponse;
  }
}

export default ModeratorUserServiceDto;
