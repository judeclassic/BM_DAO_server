//@ts-check
//User Schema
import { Schema, model } from 'mongoose';
import UserDto from '../../../../types/dtos/user.dto';
import IUserModelRepository from '../../../../types/interfaces/modules/db/models/Iuser.model';
import { ServiceAccountTypeEnum } from '../../../../types/interfaces/response/services/enums';
import { AccountTypeEnum, IAnalytics, IUser, IWallet } from '../../../../types/interfaces/response/user.response';
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
  },
  wallet: {
    address: String,
    privateKey: String,
}
});

const AnalyticSchema = new Schema<IAnalytics>({
  totalUploaded: Number,
  totalPending: Number,
  totalCompleted: Number,
  raiders: {
      totalUploaded: Number,
      totalPending: Number,
      totalCompleted: Number,
  },
  moderators: {
      totalUploaded: Number,
      totalPending: Number,
      totalCompleted: Number,
  },
  chatEngagers: {
      totalUploaded: Number,
      totalPending: Number,
      totalCompleted: Number,
  },
  collabManagers: {
      totalUploaded: Number,
      totalPending: Number,
      totalCompleted: Number,
  }
})

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
    referalCode1: {
      type: String
    },
    referalCode2: {
      type: String
    },
    referalCode3: {
      type: String
    },
    analytics: {
      totalAmount: {
        type: Number,
        default: 0
      },
      totalEarned: {
        type: Number,
        default: 0
      },
      level1: {
          amount: {
            type: Number,
            default: 0
          },
          earned: {
            type: Number,
            default: 0
          },
      },
      level2: {
          amount: {
            type: Number,
            default: 0
          },
          earned: {
            type: Number,
            default: 0
          }
      },
      level3: {
          amount: {
            type: Number,
            default: 0
          },
          earned: {
            type: Number,
            default: 0
          }
      }
  }
  },
  authenticationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  analytics: {
    type: AnalyticSchema,
  }
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
        finalObject[`${name}.${data[0]}`] = data[1];
      })
      return finalObject;
    }

    updateBalance = async (userId: string, amount: Number) => {
      try {
        const data = await this.User.findByIdAndUpdate(userId, {$inc : {
          'wallet.balance.walletBalance': amount,
          'wallet.balance.totalBalance': amount,
        }}, { new: true });
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

    updateUpdatedAnalytics = async (userId: string, type: ServiceAccountTypeEnum) => {
      try {
        const data = await this.User.findById(userId);
        if (data) {
          if (!data.analytics) data.analytics = this.createAnalytics;
          data.analytics.totalUploaded++;
          if (type === ServiceAccountTypeEnum.chatter) data.analytics.chatEngagers.totalUploaded++;
          if (type === ServiceAccountTypeEnum.collab_manager) data.analytics.collabManagers.totalUploaded++;
          if (type === ServiceAccountTypeEnum.moderators) data.analytics.moderators.totalUploaded++;
          if (type === ServiceAccountTypeEnum.raider) data.analytics.raiders.totalUploaded++;
          const updatedUser = await data.save();
          return {status: true, data: new UserDto(updatedUser ?? data)};
        } else {
          return {status: false, error: "Couldn't create user"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    updateCancelAnalytics = async (userId: string, type: ServiceAccountTypeEnum) => {
      try {
        const data = await this.User.findById(userId);
        if (data) {
          if (!data.analytics) data.analytics = this.createAnalytics;
          data.analytics.totalUploaded--;
          if (type === ServiceAccountTypeEnum.chatter) data.analytics.chatEngagers.totalUploaded--;
          if (type === ServiceAccountTypeEnum.collab_manager) data.analytics.collabManagers.totalUploaded--;
          if (type === ServiceAccountTypeEnum.moderators) data.analytics.moderators.totalUploaded--;
          if (type === ServiceAccountTypeEnum.raider) data.analytics.raiders.totalUploaded--;
          const updatedUser = await data.save();
          return {status: true, data: new UserDto(updatedUser ?? data)};
        } else {
          return {status: false, error: "Couldn't create user"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    updatePendingAnalytics = async (userId: string, type: ServiceAccountTypeEnum) => {
      try {
        const data = await this.User.findById(userId);
        if (data) {
          if (!data.analytics) data.analytics = this.createAnalytics;
          data.analytics.totalPending++;
          if (type === ServiceAccountTypeEnum.chatter) data.analytics.chatEngagers.totalPending++;
          if (type === ServiceAccountTypeEnum.collab_manager) data.analytics.collabManagers.totalPending++;
          if (type === ServiceAccountTypeEnum.moderators) data.analytics.moderators.totalPending++;
          if (type === ServiceAccountTypeEnum.raider) data.analytics.raiders.totalPending++;
          const updatedUser = await data.save();
          return { status: true, data: new UserDto(updatedUser ?? data) };
        } else {
          return { status: false, error: "Couldn't create user" };
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    updateCompletedAnalytics = async (userId: string, type: ServiceAccountTypeEnum) => {
      try {
        const data = await this.User.findById(userId);
        if (data) {
          if (!data.analytics) data.analytics = this.createAnalytics;
          data.analytics.totalCompleted++;
          if (type === ServiceAccountTypeEnum.chatter) data.analytics.chatEngagers.totalCompleted++;
          if (type === ServiceAccountTypeEnum.collab_manager) data.analytics.collabManagers.totalCompleted++;
          if (type === ServiceAccountTypeEnum.moderators) data.analytics.moderators.totalCompleted++;
          if (type === ServiceAccountTypeEnum.raider) data.analytics.raiders.totalCompleted++;
          const updatedUser = await data.save();
          return {status: true, data: new UserDto(updatedUser ?? data)};
        } else {
          return {status: false, error: "Couldn't create user"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
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
              return { status: false, error: "Couldn't update user" };
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
        const referalInformation: any = this.deepSearchDetails( 'personal_information', details);
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
        console.log(referalInformation);
        try {
            const data = await this.User.find(referalInformation);
            console.log(data.length);
            if (data) {
              return {status: true, data: data.map((user) => (new UserDto(user)).getUnSecureResponse) };
            }else {
                return { status: false, error: `Can't find Details` };
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }

    private get createAnalytics() {
      return {
        totalUploaded: 0,
        totalPending: 0,
        totalCompleted: 0,
        raiders: {
            totalUploaded: 0,
            totalPending: 0,
            totalCompleted: 0,
        },
        moderators: {
            totalUploaded: 0,
            totalPending: 0,
            totalCompleted: 0,
        },
        chatEngagers: {
            totalUploaded: 0,
            totalPending: 0,
            totalCompleted: 0,
        },
        collabManagers: {
            totalUploaded: 0,
            totalPending: 0,
            totalCompleted: 0,
        }
      }
    }
}

export default UserModel;

