//@ts-check
//User Schema
import { Schema, model } from 'mongoose';
import UserDto from '../../../../types/dtos/user.dto';
import { AvailableCountryEnum } from '../../../../types/interfaces/entities/location';
import IUserModelRepository from '../../../../types/interfaces/modules/db/models/Iuser.model';
import { AccountTypeEnum, IUser, IWallet } from '../../../../types/interfaces/response/user.response';
import { defaultLogger } from '../../logger';

const WalletSchema = new Schema<IWallet>({
  balance: {
    referalBonus: {
      type: Number,
    },
    taskBalance: {
      type: Number,
    },
    walletBalance: {
      type: Number
    },
    totalBalance: {
      type: Number
    }
  }
});

const UserSchema = new Schema<IUser>({
  accountType: {
    type: String,
    enum: Object.values(AccountTypeEnum),
    trim: true,
  },
  name: {
    type: String,
  },
  emailAddress: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  country: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  accessToken: {
    type: String
  },
  wallet: WalletSchema,
  referal: { 
    myReferalCode: {
      type: String,
    },
    referalCode: {
      type: String
    },
  },
  authenticationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
});

export const User = model("User", UserSchema)

class  UserModel implements  IUserModelRepository {
  User: typeof User;

    constructor() {
        this.User =  User;
    }

    private deepSearchDetails = (name: string, data: any) => {
      const finalObject: any = {};
      Object.entries(data).forEach((data) => {
          finalObject[`personal_information.${data[0]}`] = data[1];
      })
      return finalObject;
    }

    saveUserToDB = async (details: Partial<IUser>) => {
        try {
            const data = await this.User.create(details);
            if (data) {
              return {status: true, data: new UserDto(data)};
            } else {
              return {status: false, error: "Couldn't create user"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    updateUserDetailToDB = async (id : string, details : Partial<IUser>) => {
        try {
            const data = await this.User.findByIdAndUpdate(id, details, {new: true});
            if (data) {
              return {status: true, data: new UserDto(data)};
            } else {
              return {status: false, error: "Couldn't update user"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    checkIfExist = async (details : Partial<IUser>) => {
        try {
            const data = await this.User.findOne(details);
            if (data) {
              return {status: true, data: new UserDto(data)};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }

    checkIfReferalExist = async (details : Partial<IUser['referal']>) => {
        const referalInformation: any = this.deepSearchDetails( 'referal', details);
        try {
            const data = await this.User.findOne(referalInformation);
            if (data) {
              return {status: true, data: new UserDto(data)};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }

    getReferals = async (details : Partial<IUser['referal']>) => {
        const referalInformation: any = this.deepSearchDetails( 'referal', details);
        try {
            const data = await this.User.find(referalInformation);
            if (data) {
              return {status: true, data: data.map((user) => (new UserDto(user)).getUnSecureResponse) };
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }
}

export default UserModel;

