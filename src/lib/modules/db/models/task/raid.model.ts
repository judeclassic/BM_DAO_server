import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import { defaultLogger } from '../../../logger';
import { IRaid } from '../../../../../types/interfaces/response/services/raid.response';
import IRaidModelRepository from '../../../../../types/interfaces/modules/db/models/service/raid.model';
import { RaidDto, MultipleRaidDto } from '../../../../../types/dtos/service/raids.dto';


const RaidSchema = new Schema<IRaid>({
  assignerId: String,
  assigneeId: String,
  serviceId: String,
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'RaiderTask',
  },
  timeLine: Number,
  taskStatus: String,
  proofs: [String],
});

RaidSchema.plugin(mongoosePaginate);

export const Raid = model<IRaid, PaginateModel<IRaid>>("Raid", RaidSchema)

class  RaidModel implements  IRaidModelRepository {
    Raid: typeof Raid;

    constructor() {
        this.Raid =  Raid;
    }

    deleteAllRaids = async ( { taskId } : { taskId: string; }) => {
      try {
        const data = await this.Raid.deleteMany({ taskId });
        if (data) {
          return { status: true }
        } else {
          return {status: false, error: "Couldn't create Raid" };
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    createRaid = async (details: IRaid) => {
      try {
        const data = await this.Raid.create(details);
        if (data) {
          return {status: true, data: new RaidDto(data)};
        } else {
          return {status: false, error: "Couldn't create Raid" };
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    updateRaid = async (id: string, details: Partial<IRaid>) => {
      try {
        const data = await this.Raid.findByIdAndUpdate(id, details, { new: true });
        if (data) {
          return {status: true, data: new RaidDto(data)};
        } else {
          return {status: false, error: "Couldn't update Raid"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }
  
    checkIfExist = async (details: Partial<IRaid>) => {
      try {
        const data = await this.Raid.findOne(details);
        if (data) {
          return {status: true, data: new RaidDto(data)};
        } else {
          return {status: false, error: "Couldn't update Raid"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    getAllRaid = async (details: Partial<IRaid>, option: { page: number; limit: number; }) => {
      try {
        const data = await this.Raid.paginate(details, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: new MultipleRaidDto({ 
              raids : data.docs,
              totalRaids: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }

    getAllRaidByStatus = async (details: Partial<IRaid>, option: { page: number; limit: number; }) => {
      try {
        const skip = (option.page - 1) * option.limit;
        const totalData = await this.Raid.countDocuments(details);
        // const data = await this.Raid.paginate(details, {...option, sort: {_id: -1}});
        const data = await this.Raid.find(details).populate("taskId").skip(skip).limit(option.limit);
        if (data) {
          return {status: true,
            data: new MultipleRaidDto({ 
              raids : data,
              totalRaids: totalData,
              hasNextPage: true
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
    
    getAllRaids = async (details: Partial<IRaid>[]) => {
      try {
        const data = await this.Raid.find(details);
        if (data) {
          return { status: true, data: data.map((service) => new RaidDto(service)) };
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
    getAllRaidsInPages = async (details: Partial<IRaid>[], option: { page: number; limit: number; }) => {
      try {
        const data = await this.Raid.paginate(details, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: new MultipleRaidDto({ 
              raids : data.docs,
              totalRaids: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
  
    getAllRaidByWorkStatus = async  (status: 'free' | 'engage', option: { page: number; limit: number; }) => {
      try {
        const currentTime = Date.parse((new Date()).toISOString())
        const data = status === 'free' ?
            await this.Raid.paginate({ work_timeout: { $lt: currentTime }, subscriptionDate: { $lt: currentTime } }, {...option, sort: {_id: -1}})
            :
            await this.Raid.paginate({ work_timeout: { $gt: currentTime }, subscriptionDate: { $lt: currentTime } }, {...option, sort: {_id: -1}})
  
        if (data) {
          return {status: true,
            data: new MultipleRaidDto({ 
              raids : data.docs,
              totalRaids: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
  
    deleteRaid = async (requestId: string) => {
      try {
        const data = await this.Raid.findByIdAndRemove(requestId);
        if (data) {
          return {status: true, data: new RaidDto(data)};
        } else {
          return {status: false, error: "Couldn't create user"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }
}

export default RaidModel;

