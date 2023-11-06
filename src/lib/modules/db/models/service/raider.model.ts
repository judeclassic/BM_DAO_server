import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import UserServiceDto, { MultipleUserServiceDto } from '../../../../../types/dtos/service/raiders.dto';
import IRaiderUserServiceModelRepository from '../../../../../types/interfaces/modules/db/models/service/raider.model';
import { ServiceAccountTypeEnum } from '../../../../../types/interfaces/response/services/enums';
import { IAnalytic, IRaiderUserService } from '../../../../../types/interfaces/response/services/raider.response';
import { defaultLogger } from '../../../logger';

const AnalyticSchema = new Schema<IAnalytic>({
  availableTask: {
    type: Number,
    default: 0,
  },
  pendingTask: {
    type: Number,
    default: 0,
  },
  completedTask: {
    type: Number,
    default: 0,
  },
})

const RaiderUserServiceSchema = new Schema<IRaiderUserService>({
  accountType: {
    type: String,
    enum: Object.values(ServiceAccountTypeEnum),
    required: [true, 'accountType is required'],
  },
  userId: {
    type: String,
  },
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date
  },
  isVerified: {
    type: Boolean
  },
  subscriptionDate: {
    type: Number,
  },
  work_timeout: {
    type: Number,
  },
  analytics: {
    type: AnalyticSchema,
    default: {
      availableTask: 0,
      pendingTask: 0,
      completedTask: 0
    }
  }
});

RaiderUserServiceSchema.plugin(mongoosePaginate);

export const UserService = model<IRaiderUserService, PaginateModel<IRaiderUserService>>("RaiderService", RaiderUserServiceSchema);

class  RaiderUserServiceModel implements  IRaiderUserServiceModelRepository {
  UserService: typeof UserService;

  constructor() {
    this.UserService =  UserService;
  }

  createUserService = async (details: IRaiderUserService) => {
    try {
      const data = await this.UserService.create(details);
      if (data) {
        return {status: true, data: new UserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't update userservice"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return {status: false, error };
    }
  }

  updateUserService = async (id: string, details: Partial<IRaiderUserService>) => {
    try {
      const data = await this.UserService.findByIdAndUpdate(id, details, { new: true });
      if (data) {
        return {status: true, data: new UserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't update userservice"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return { status: false, error };
    }
  }

  updateCreatedAnalytics = async (userId: string) => {
    try {
      const data = await this.UserService.findOne({userId});
      if (data) {
        data.analytics.availableTask++;
        data.analytics.pendingTask++;
        const updatedUser = await data.save();
        return {status: true, data: new UserServiceDto(updatedUser ?? data)};
      } else {
        return {status: false, error: "Couldn't updated user"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return { status: false, error };
    }
  }

  updateCompletedAnalytics = async (userId: string) => {
    try {
      const data = await this.UserService.findOne({userId});
      if (data) {
        data.analytics.pendingTask--;
        data.analytics.completedTask++;
        const updatedUser = await data.save();
        return {status: true, data: new UserServiceDto(updatedUser ?? data)};
      } else {
        return {status: false, error: "Couldn't update userservice"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return { status: false, error };
    }
  }

  updateCancelAnalytics = async (userId: string) => {
    try {
      const data = await this.UserService.findOne({userId});
      if (data) {
        data.analytics.availableTask--;
        data.analytics.pendingTask--;
        const updatedUser = await data.save();
        return {status: true, data: new UserServiceDto(updatedUser ?? data)};
      } else {
        return {status: false, error: "Couldn't update userservice"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return { status: false, error };
    }
  }

  checkIfExist = async (details: Partial<IRaiderUserService>) => {
    try {
      const data = await this.UserService.findOne(details);
      if (data) {
        return {status: true, data: new UserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't update userservice"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return { status: false, error };
    }
  }
  getAllUserService = async (details: Partial<IRaiderUserService>, option: { page: number; limit: number; }) => {
    try {
      const data = await this.UserService.paginate(details, option);
      if (data) {
        return {status: true,
          data: new MultipleUserServiceDto({ 
            userServices : data.docs,
            totalUserServices: data.totalDocs,
            hasNextPage: data.hasNextPage
          })};
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return { status: false, error };
    }
  }
  getAllUserServices = async (details: Partial<IRaiderUserService>[]) => {
    try {
      const data = await this.UserService.find(details);
      if (data) {
        return {status: true, data: data.map((service) => new UserServiceDto(service)) };
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return {status: false, error };
    }
  }
  getAllUserServicesInPages = async (details: Partial<IRaiderUserService>[], option: { page: number; limit: number; }) => {
    try {
      const data = await this.UserService.paginate(details, option);
      if (data) {
        return {status: true,
          data: new MultipleUserServiceDto({ 
            userServices : data.docs,
            totalUserServices: data.totalDocs,
            hasNextPage: data.hasNextPage
          })};
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return {status: false, error };
    }
  }

  getAllUserServiceByWorkStatus = async  (status: 'free' | 'engage', option: { page: number; limit: number; }) => {
    try {
      const currentTime = Date.parse((new Date()).toISOString())
      const data = status === 'free' ?
          await this.UserService.paginate({ work_timeout: { $lt: currentTime }, subscriptionDate: { $lt: currentTime } }, option)
          :
          await this.UserService.paginate({ work_timeout: { $gt: currentTime }, subscriptionDate: { $lt: currentTime } }, option)

      if (data) {
        return {status: true,
          data: new MultipleUserServiceDto({ 
            userServices : data.docs,
            totalUserServices: data.totalDocs,
            hasNextPage: data.hasNextPage
          })};
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return {status: false, error };
    }
  }

  countUsersInPlatform = async (details: Partial<IRaiderUserService>) => {
    try {
      const data = await this.UserService.count(details);
      if (data) {
        return { status: true, data };
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return {status: false, error };
    }
  }

  deleteUserService = async (requestId: string) => {
    try {
      const data = await this.UserService.findByIdAndRemove(requestId);
      if (data) {
        return {status: true, data: new UserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't create user"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return {status: false, error };
    }
  }
}

export default RaiderUserServiceModel;

