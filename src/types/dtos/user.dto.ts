import AutheticatedUserInterface from "../interfaces/requests/user/authencated-user";
import { AccountTypeEnum, IAnalytics, IUser, IWallet } from "../interfaces/response/user.response";
import ModeratorUserServiceDto from "./service/moderators.dto";
import RaiderUserServiceDto from "./service/raiders.dto";


export enum AmountPercentageEnum {
  total = 100,
  referal1 = 20,
  referal2 = 10,
  referal3 = 10,
}




export enum AmountEnum {
  subscriptionPackage1 = 5.00,
  moderatorSubscriptionPackage1 = 50.0,

  raidClientFollowCharge = 0.015,
  raidClientRaidCharge = 0.3,
  raidClientLikeCharge = 0.01,
  raidClientTweetCharge = 0.25,
  raidClientCommentCharge = 0.1,
  raidClientRetweetCharge = 0.2,

  raidRaiderFollowPay = 0.007,
  raidRaiderRaidPay = 0.15,
  raidRaiderLikePay = 0.005,
  raidRaiderTweetPay = 0.1,
  raidRaiderCommentpay = 0.05,
  raidRaiderRetweetpay = 0.1,

  raidModeratorFollowPay = 0.002,
  raidModeratorRaidPay = 0.03,
  raidModeratorLikePay = 0.001,
  raidModeratorTweetPay = 0.05,
  raidModeratorCommentpay = 0.01,
  raidModeratorRetweetpay = 0.02,

  chatterCharge = 0.7,
  chatterPay = 0.5,
}

export interface IWalletResponse {
  balance: {
      referalBonus: number;
      taskBalance: number;
      walletBalance: number;
      totalBalance: number;
  };
}

export interface UnSecureUserResponseInterface {
  accountType: AccountTypeEnum,
  id?: string;
  username: string;
  emailAddress: string;
  phoneNumber: string;
  updatedAt?: string;
  createdAt?: string;
  isVerified?: boolean;
  analytics?: IAnalytics;
}

export interface UserResponseInterface {
    _id?: string;
    accountType: AccountTypeEnum;
    name: string;
    username: string;
    emailAddress: string;
    phoneNumber?: string;
    country?: string;
    referal: {
        myReferalCode: string;
        analytics: IUser['referal']['analytics']
    };
    updatedAt?: Date;
    createdAt?: Date;
    accessToken?: string;
    isVerified?: boolean;
    wallet: IWalletResponse;
    authenticationCode?: string;
    raiderService?: RaiderUserServiceDto;
    moderatorService?: ModeratorUserServiceDto;
    analytics?: IAnalytics;
}

export class WalletDto implements IWallet {
  balance: {
    referalBonus: number;
    taskBalance: number;
    walletBalance: number;
    totalBalance: number;
  };

  constructor(wallet: IWallet) {
    this.balance = wallet.balance;
  }

  get getModel() {
    return {
      balance: this.balance,
    } as IWallet;
  }

  get getResponse() {
    return {
      balance: this.balance,
    } as IWalletResponse;
  }
}

class UserDto implements IUser {
  public id?: string;
  public accountType: AccountTypeEnum;
  public name: string;
  public username: string;
  public emailAddress: string;
  public phoneNumber?: string;
  public country?: string;
  public password: string;
  public updatedAt?: Date;
  public createdAt?: Date;
  public accessToken?: string;
  public isVerified?: boolean;
  public wallet: WalletDto;
  public referal: IUser['referal'];
  public authenticationCode?: string;
  public raiderService?: RaiderUserServiceDto;
  public moderatorService?: ModeratorUserServiceDto;

  public referals?: UnSecureUserResponseInterface[] = []
  public analytics?: IAnalytics;
  
  constructor(user: IUser) {
    this.id = user._id;
    this.accountType = user.accountType;
    this.name = user.name;
    this.username = user.username;
    this.emailAddress = user.emailAddress;
    this.phoneNumber = user.phoneNumber;
    this.country = user.country;
    this.password = user.password;
    this.updatedAt = user.updatedAt;
    this.createdAt = user.createdAt;
    this.accessToken = user.accessToken;
    this.isVerified = user.isVerified;
    this.wallet = new WalletDto(user.wallet);
    this.referal = user.referal;
    this.authenticationCode = user.authenticationCode;
    this.analytics = user.analytics;
    
  }

  
  get getUserForToken() {
    return {
      id: this.id,
      username: this.name,
      email: this.emailAddress,
      createdAt: this.createdAt?.toString(),
    } as AutheticatedUserInterface
  }

  get getModel() {
    return {
      _id: this.id,
      accountType: this.accountType,
      name: this.name,
      username: this.username,
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      country: this.country,
      password: this.password,
      accessToken: this.accessToken,
      isVerified: this.isVerified,
      updatedAt: this.updatedAt ? new Date(this.updatedAt): undefined,
      createdAt: this.createdAt ? new Date(this.createdAt): undefined,
      wallet: this.wallet.getModel,
      referal: this.referal,
      authenticationCode: this.authenticationCode,
      analytics: this.analytics
    } as IUser
  }

  get getDBModel(): IUser {
    return {
      accountType: this.accountType,
      name: this.name,
      username: this.username,
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      country: this.country,
      password: this.password,
      accessToken: this.accessToken,
      isVerified: this.isVerified,
      updatedAt: this.updatedAt ? new Date(this.updatedAt): undefined,
      createdAt: this.createdAt ? new Date(this.createdAt): undefined,
      wallet: this.wallet.getModel,
      referal: this.referal,
      authenticationCode: this.authenticationCode,
      analytics: this.analytics
    } as IUser
  }

  get getResponse(): UserResponseInterface {
    return {
      accountType: this.accountType,
      id: this.id,
      name: this.name,
      username: this.username,
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      accessToken: this.accessToken,
      wallet: this.wallet.getResponse,
      referal: { myReferalCode: this.referal.myReferalCode, analytics: this.referal.analytics },
      country: this.country,
      isVerified: this.isVerified,
      updatedAt: this.updatedAt ? new Date(this.updatedAt): undefined,
      createdAt: this.createdAt ? new Date(this.createdAt): undefined,
      raiderService: this.raiderService,
      moderatorService: this.moderatorService,
      referals: this.referals,
      analytics: this.analytics
    } as UserResponseInterface
  }

  get getUnSecureResponse() {
    return {
      accountType: this.accountType,
      id: this.id,
      name: this.name,
      username: this.username,
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      isVerified: this.isVerified,
      updatedAt: this.updatedAt ? new Date(this.updatedAt): undefined,
      createdAt: this.createdAt ? new Date(this.createdAt): undefined,
      referal: this.referal,
      analytics: this.analytics
    } as UnSecureUserResponseInterface
  }

  toTokens = () => {
    return {
      accountType: this.accountType,
      accessToken: this.accessToken!,
    }
  }

  updateUserWithdrawableBalance = ({ amount, multiplier = 1, type  }: { amount: AmountEnum, multiplier?: number; type: 'charged' | 'paid' }) => {
    if (type === 'charged') {
      this.wallet.balance.walletBalance -= (amount * multiplier);
      this.wallet.balance.totalBalance -= (amount * multiplier);
      return (this.wallet.balance.walletBalance > 0);
    }
    this.wallet.balance.walletBalance += (amount * multiplier);
    this.wallet.balance.totalBalance += (amount * multiplier);
    return (this.wallet.balance.walletBalance > 0);
  }

  updateReferalBalance = ({ amount, percentage, level }: { amount: AmountEnum, percentage: AmountPercentageEnum, level: number }) => {
    this.wallet.balance.referalBonus = this.wallet.balance.referalBonus + (amount * percentage / 100);
    this.wallet.balance.totalBalance = this.wallet.balance.totalBalance + (amount * percentage / 100);
    this.referal.analytics.totalAmount += 1;
    this.referal.analytics.totalEarned += (amount * percentage / 100);
    if (level === 1) {
      this.referal.analytics.level1.amount += 1;
      this.referal.analytics.level1.earned += (amount * percentage / 100);
    }
    if (level === 2) {
      this.referal.analytics.level2.amount += 1;
      this.referal.analytics.level2.earned += (amount * percentage / 100);
    }
    if (level === 3) {
      this.referal.analytics.level3.amount += 1;
      this.referal.analytics.level3.earned += (amount * percentage / 100);
    }
  }
}

export default UserDto;