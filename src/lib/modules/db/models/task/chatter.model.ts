import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import { defaultLogger } from '../../../logger';
import { IChatTaskInformation, IChatterTask, TaskPriorityEnum } from '../../../../../types/interfaces/response/task/chatter_task.response';
import { ChatterTaskDto, MultipleChatterTaskDto } from '../../../../../types/dtos/task/chatters.dto';
import IChatterTaskModelRepository from '../../../../../types/interfaces/modules/db/models/task/Ichatter.model';
import { ServiceAccountTypeEnum } from '../../../../../types/interfaces/response/services/enums';


const ChatTaskInformationSchema = new Schema<IChatTaskInformation>({
  serviceType: {
    type: String,
    enum: Object.values(ServiceAccountTypeEnum),
  },
  postLink: String,
  compaignCaption: String,
  chatterPerSession: Number,
  hoursPerDay: Number,
  startDate: Date,
  days: Number
});


const ChatterTaskSchema = new Schema<IChatterTask>({
  userId: {
    type: String,
    required: [true, 'TaskId is required'],
  },
  availableTask: {
    type: Number,
  },
  totalTasks: {
    type: Number,
  },
  completedTasks: {
    type: Number,
  },
  approvedTask: {
    type: Number,
  },
  raidInformation: ChatTaskInformationSchema,
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

ChatterTaskSchema.plugin(mongoosePaginate);

export const Task = model<IChatterTask, PaginateModel<IChatterTask>>("ChatterTask", ChatterTaskSchema)

class  ChatterTaskModel implements  IChatterTaskModelRepository {
  Task: typeof Task;

    constructor() {
        this.Task =  Task;
    }

    saveTaskToDB = async (details: Partial<IChatterTask>) => {
        try {
            const data = await this.Task.create(details);
            if (data) {
              return {status: true, data: new ChatterTaskDto(data)};
            } else {
              return {status: false, error: "Couldn't create Task"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    updateTaskDetailToDB = async (id : string, details : Partial<IChatterTask>) => {
        try {
            const data = await this.Task.findByIdAndUpdate(id, details, { new: true });
            console.log(data);
            if (data) {
              return {status: true, data: new ChatterTaskDto(data)};
            } else {
              return {status: false, error: "Couldn't update Task"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    checkIfExist = async (details : Partial<IChatterTask>) => {
        try {
            const data = await this.Task.findOne(details);
            if (data) {
              return {status: true, data: new ChatterTaskDto(data)};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }
    
    getAllTask = async (details: Partial<IChatterTask>, option: { page: number, limit: number }) => {
      try {
        const data = await this.Task.paginate(details, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: new MultipleChatterTaskDto({
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

    getActiveTask = async (details: Partial<IChatterTask>, option: { page: number, limit: number }) => {
      try {
        const date = (new Date()).toISOString();
        const timeLine = Date.parse(date);

        const data = await this.Task.paginate({ startTimeLine: { $lt: timeLine }, endTimeLine: { $gt: timeLine }, ...details }, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: new MultipleChatterTaskDto({
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

    getFutureTask = async (details: Partial<IChatterTask>, option: { page: number, limit: number }) => {
      try {
        const date = (new Date()).toISOString();
        const timeLine = Date.parse(date);

        const data = await this.Task.paginate({ endTimeLine: { $gt: timeLine }, ...details }, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: new MultipleChatterTaskDto({
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

export default ChatterTaskModel;