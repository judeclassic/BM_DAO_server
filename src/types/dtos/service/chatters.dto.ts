import { IAnalytic, IChatterSocialHandle, IChatterUserService, IMultipleChatterUserService } from "../../interfaces/response/services/chatter/chatter.response";
import { ISubSciptionStatus, ServiceAccountTypeEnum } from "../../interfaces/response/services/enums";

export interface IChatterUserServiceResponse {
  _id?: string;
  accountType: ServiceAccountTypeEnum;
  userId: string;
  updatedAt?: Date;
  createdAt?: Date;
  subscriptionStatus: ISubSciptionStatus;
  isVerified?: boolean;
  analytics: IAnalytic;
  handles: IChatterSocialHandle
}

export interface IMultipleChatterUserServiceResponse {
  userServices: IChatterUserServiceResponse[];
  totalUserServices: number;
  hasNextPage: boolean;
}

class ChatterUserServiceDto implements IChatterUserService {
  readonly _id?: string;
  accountType: ServiceAccountTypeEnum;
  userId: string;
  updatedAt?: Date;
  createdAt?: Date;
  subscriptionDate: number;
  isVerified?: boolean;
  handles: IChatterSocialHandle;
  work_timeout: number;
  analytics: IAnalytic;
  currentClaimDay: Date;
  nextClaimDay: Date;
  
  
  constructor (subUser: IChatterUserService) {
    this._id = subUser._id;
    this.accountType = subUser.accountType;
    this.userId = subUser.userId;
    this.updatedAt = subUser.updatedAt;
    this.createdAt = subUser.createdAt;
    this.subscriptionDate = subUser.subscriptionDate;
    this.isVerified = subUser.isVerified;
    this.handles = subUser.handles;
    this.work_timeout = subUser.work_timeout;
    this.analytics = subUser.analytics;
    this.currentClaimDay = subUser.currentClaimDay;
    this.nextClaimDay = subUser.nextClaimDay
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
    } as IChatterUserService
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
      analytics: this.analytics,
      handles: this.handles
    } as IChatterUserServiceResponse;
  }
  
  get isUserSubscribed() {
    const currentTime = Date.parse((new Date()).toISOString());
    return ( currentTime < this.expirationDate );
  }

  static createRequest({ userId, accountType, handles }: { userId: string; accountType: ServiceAccountTypeEnum; handles: IChatterSocialHandle }): IChatterUserService {
    const now = new Date();
    const pastdate = new Date(now);
    pastdate.setDate(now.getDate() - 3);
    const formattedPastDate = pastdate.toISOString();

    return {
      accountType: accountType,
      userId: userId,
      updatedAt: new Date(),
      createdAt: new Date(),
      subscriptionDate: Date.parse((new Date()).toISOString()),
      isVerified: false,
      work_timeout: Date.parse((new Date()).toISOString()),
      handles: handles,
      analytics: {
        availableTask: 0,
        pendingTask: 0,
        completedTask: 0,
      },
      currentClaimDay: new Date(),
      nextClaimDay: new Date(formattedPastDate),
    }
  }
}
export class MultipleChatterUserServiceDto implements IMultipleChatterUserService {
  userServices: ChatterUserServiceDto[];
  totalUserServices: number;
  hasNextPage: boolean;
  

  constructor (subUser: IMultipleChatterUserService) {
    this.userServices = subUser.userServices.map((userService) => new ChatterUserServiceDto(userService));
    this.totalUserServices = subUser.totalUserServices;
    this.hasNextPage = subUser.hasNextPage;
  }

  get getResponse() {
    return {
      userServices: this.userServices.map((userService) => userService.getResponse ),
      totalUserServices: this.totalUserServices,
      hasNextPage: this.hasNextPage
    } as IMultipleChatterUserServiceResponse;
  }
}

export default ChatterUserServiceDto;
