import { ServiceAccountTypeEnum } from "../../response/services/enums";
import { ISocialHandle } from "../../response/services/raider.response";
import { AccountTypeEnum } from "../../response/user.response";

export interface ICreateUserRequest {
  accountType: AccountTypeEnum;
  name: string;
  emailAddress: string;
  username: string;
  password: string;
  country: string;
  referalCode?: string;
}

export interface ICreateUserServiceRequest {
  accountType: ServiceAccountTypeEnum;
  userId: string;
  handles: ISocialHandle
}
