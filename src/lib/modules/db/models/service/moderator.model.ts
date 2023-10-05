import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import ModeratorUserServiceDto, { MultipleModeratorServiceDto } from '../../../../../types/dtos/service/moderators.dto';
import UserServiceDto, { MultipleUserServiceDto } from '../../../../../types/dtos/service/raiders.dto';
import IModeratorServiceModelRepository from '../../../../../types/interfaces/modules/db/models/service/moderator.model';
import { ServiceAccountTypeEnum } from '../../../../../types/interfaces/response/services/enums';
import { IModeratorUserService } from '../../../../../types/interfaces/response/services/moderator.response';
import { defaultLogger } from '../../../logger';

const ModeratorUserServiceSchema = new Schema<IModeratorUserService>({
  accountType: {
    type: String,
    enum: Object.values(ServiceAccountTypeEnum),
    required: [true, 'accountType is required'],
  },
  name: {
    type: String,
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
});

ModeratorUserServiceSchema.plugin(mongoosePaginate);

export const ModeratorUserService = model<IModeratorUserService, PaginateModel<IModeratorUserService>>("Moderator", ModeratorUserServiceSchema);

class  ModeratorUserServiceModel implements  IModeratorServiceModelRepository {
  UserService: typeof ModeratorUserService;

  constructor() {
    this.UserService =  ModeratorUserService;
  }

  createUserService = async (details: IModeratorUserService) => {
    try {
      const data = await this.UserService.create(details);
      if (data) {
        return {status: true, data: new ModeratorUserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't create moderator service"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return {status: false, error };
    }
  }
  updateUserService = async (id: string, details: Partial<IModeratorUserService>) => {
    try {
      const data = await this.UserService.findByIdAndUpdate(id, details, { new: true });
      if (data) {
        return {status: true, data: new ModeratorUserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't update userservice"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return {status: false, error };
    }
  }

  checkIfExist = async (details: Partial<IModeratorUserService>) => {
    try {
      const data = await this.UserService.findOne(details);
      if (data) {
        return {status: true, data: new ModeratorUserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't update userservice"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return {status: false, error };
    }
  }
  getAllUserService = async (details: Partial<IModeratorUserService>, option: { page: number; limit: number; }) => {
    try {
      const data = await this.UserService.paginate(details, option);
      if (data) {
        return {status: true,
          data: new MultipleModeratorServiceDto({ 
            moderatorServices : data.docs,
            totalModeratorServices: data.totalDocs,
            hasNextPage: data.hasNextPage
          })};
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return {status: false, error };
    }
  }
  getAllUserServices = async (details: Partial<IModeratorUserService>[]) => {
    try {
      const data = await this.UserService.find(details);
      if (data) {
        return {status: true, data: data.map((service) => new ModeratorUserServiceDto(service)) };
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return {status: false, error };
    }
  }
  getAllUserServicesInPages = async (details: Partial<IModeratorUserService>[], option: { page: number; limit: number; }) => {
    try {
      const data = await this.UserService.paginate(details, option);
      if (data) {
        return {status: true,
          data: new MultipleModeratorServiceDto({ 
            moderatorServices : data.docs,
            totalModeratorServices: data.totalDocs,
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
          data: new MultipleModeratorServiceDto({ 
            moderatorServices : data.docs,
            totalModeratorServices: data.totalDocs,
            hasNextPage: data.hasNextPage
          })};
      } else {
        return {status: false, error: "Couldn't get store details"};
      }
    } catch (error) {
        return {status: false, error };
    }
  }

  countUsersInPlatform = async (details: Partial<IModeratorUserService>) => {
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
        return {status: true, data: new ModeratorUserServiceDto(data)};
      } else {
        return {status: false, error: "Couldn't create user"};
      }
    } catch (error) {
        defaultLogger.error(error);
        return {status: false, error };
    }
  }
}

export default ModeratorUserServiceModel;

