import AutheticatedUserInterface from "../interfaces/requests/user/authencated-user";
import AdminInterface from "../interfaces/response/admin.response";
import UserInterface, { AccessStatusEnum } from "../interfaces/response/admin.response";

export interface AdminResponseInterface {
  id?: string;
  name: string;
  emailAddress: string;
  password: string;
  updatedAt?: Date;
  createdAt?: Date;
  accessToken?: string;
  isVerified?: boolean;
  accessStatus: AccessStatusEnum
}

class AdminDto implements AdminInterface {
  public id?: string;
  public name: string;
  public emailAddress: string;
  public password: string;
  public updatedAt?: Date;
  public createdAt?: Date;
  public accessToken?: string;
  public isVerified?: boolean;
  public accessStatus: AccessStatusEnum

  constructor(admin: AdminInterface) {
    this.id = admin._id;
    this.name = admin.name;
    this.emailAddress = admin.emailAddress;
    this.password = admin.password;
    this.updatedAt = admin.updatedAt
    this.createdAt = admin.createdAt;
    this.accessToken = admin.accessToken;
    this.isVerified = admin.isVerified;
    this.accessStatus = admin.accessStatus
  }

  forToken = () => {
    return {
      id: this.id,
      username: this.name,
      email: this.emailAddress,
      createdAt: this.createdAt?.toISOString(),
    } as AutheticatedUserInterface
  }

  get getModel() {
    return {
      _id: this.id,
      name: this.name,
      emailAddress: this.emailAddress,
      password: this.password,
      accessToken: this.accessToken,
      isVerified: this.isVerified,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      accessStatus: this.accessStatus
    } as UserInterface
  }

  get getResponse() {
    return {
      id: this.id,
      name: this.name,
      emailAddress: this.emailAddress,
      accessToken: this.accessToken,
      isVerified: this.isVerified,
      updatedAt: this.updatedAt ? new Date(this.updatedAt): undefined,
      createdAt: this.createdAt ? new Date(this.createdAt): undefined,
      accessStatus: this.accessStatus
    } as AdminResponseInterface
  }

  toTokens = () => {
    return {
      accessToken: this.accessToken!,
    }
  }
}

export default AdminDto;
