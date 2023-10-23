import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import IRaiderTaskModelRepository from '../../../../../types/interfaces/modules/db/models/task/Iraider.model';
import { IRaiderTask, IRaidTaskInformation, RaidActionEnum, TaskPriorityEnum } from '../../../../../types/interfaces/response/task/raider_task.response';
import { defaultLogger } from '../../../logger';
import { MultipleRaiderTaskDto, RaiderTaskDto } from '../../../../../types/dtos/task/raiders.dto';

const RaidTaskInformationSchema = new Schema<IRaidTaskInformation>({
  action: {
    type: String,
    enum: Object.values(RaidActionEnum)
  },
  raidLink: {
    type: String,
  },
  campaignCaption: {
    type: String,
  },
  amount: {
    type: Number,
  },
});


const RaiderTaskSchema = new Schema<IRaiderTask>({
  userId: {
    type: String,
    required: [true, 'TaskId is required'],
  },
  availableRaids: {
    type: Number,
  },
  totalRaids: {
    type: Number,
  },
  completedRaids: {
    type: Number,
  },
  approvedRaids: {
    type: Number,
  },
  raidInformation: RaidTaskInformationSchema,
  startedAt: {
    type: Date,
    default: new Date()
  },
  endedAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  level: {
    type: String,
    enum: Object.values(TaskPriorityEnum)
  },
  startTimeLine: {
    type: Number,
  },
  endTimeLine: {
    type: Number,
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  moderatorId: {
    type: String
  }
});

RaiderTaskSchema.plugin(mongoosePaginate);

export const Task = model<IRaiderTask, PaginateModel<IRaiderTask>>("RaiderTask", RaiderTaskSchema)

class  RaiderTaskModel implements  IRaiderTaskModelRepository {
  Task: typeof Task;

    constructor() {
        this.Task =  Task;
    }

    saveTaskToDB = async (details: Partial<IRaiderTask>) => {
        try {
            const data = await this.Task.create(details);
            if (data) {
              return {status: true, data: new RaiderTaskDto(data)};
            } else {
              return {status: false, error: "Couldn't create Task"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    updateTaskDetailToDB = async (id : string, details : Partial<IRaiderTask>) => {
        try {
            const data = await this.Task.findByIdAndUpdate(id, details, {new: true});
            console.log(data);
            if (data) {
              return {status: true, data: new RaiderTaskDto(data)};
            } else {
              return {status: false, error: "Couldn't update Task"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    checkIfExist = async (details : Partial<IRaiderTask>) => {
        try {
            const data = await this.Task.findOne(details);
            if (data) {
              return {status: true, data: new RaiderTaskDto(data)};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }
    
    getAllTask = async (details: Partial<IRaiderTask>, option: { page: number, limit: number }) => {
      try {
        const data = await this.Task.paginate(details, option);
        if (data) {
          return {status: true,
            data: new MultipleRaiderTaskDto({
              tasks : data.docs,
              totalTasks: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }

    getActiveTask = async (details: Partial<IRaiderTask>, option: { page: number, limit: number }) => {
      try {
        const date = (new Date()).toISOString();
        const timeLine = Date.parse(date);

        const data = await this.Task.paginate({ startTimeLine: { $lt: timeLine }, endTimeLine: { $gt: timeLine }, ...details }, option);
        if (data) {
          return {status: true,
            data: new MultipleRaiderTaskDto({
              tasks : data.docs,
              totalTasks: data.totalDocs,
              hasNextPage: data.hasNextPage
            })
          };
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }

    getFutureTask = async (details: Partial<IRaiderTask>, option: { page: number, limit: number }) => {
      try {
        const date = (new Date()).toISOString();
        const timeLine = Date.parse(date);

        const data = await this.Task.paginate({ endTimeLine: { $gt: timeLine }, ...details }, option);
        if (data) {
          return {status: true,
            data: new MultipleRaiderTaskDto({
              tasks : data.docs,
              totalTasks: data.totalDocs,
              hasNextPage: data.hasNextPage
            })
          };
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
}

export default RaiderTaskModel;