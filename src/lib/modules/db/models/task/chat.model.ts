import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import { defaultLogger } from '../../../logger';
import { IChatterTask } from '../../../../../types/interfaces/response/task/chatter_task.response';
import { ChatterTaskDto, MultipleChatterTaskDto } from '../../../../../types/dtos/task/chatters.dto';
import IChatterTaskModelRepository from '../../../../../types/interfaces/modules/db/models/task/Ichatter.model';
import { IChatTask, TaskStatusStatus } from '../../../../../types/interfaces/response/services/chatter/chat_cliamable.response';
import IChatTaskModelRepository from '../../../../../types/interfaces/modules/db/models/service/chat.model';
import { ChatTaskDto, MultipleChatTaskDto } from '../../../../../types/dtos/service/chats.dto';
import { IRaid } from '../../../../../types/interfaces/response/services/raid.response';


const ChatterTaskSchema = new Schema<IChatTask>({
  assignerId: String,
  assigneeId: String,
  taskId: String,
  serviceId: String,
  // task: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'ChatterTask',
  // },
  startTime: Number,
  endTime: Number,
  timeLine: Number,
  taskStatus: {
    type: String,
    enum: Object.values(TaskStatusStatus),
  },
  proofs: [String],
});

ChatterTaskSchema.plugin(mongoosePaginate);

export const Task = model<IChatTask, PaginateModel<IChatTask>>("ChatTask", ChatterTaskSchema)

class  ChatTaskModel implements  IChatTaskModelRepository {
  ChatTask: typeof Task;

    constructor() {
        this.ChatTask =  Task;
    }

    deleteAllTask = async ( { taskId } : { taskId: string; }) => {
      try {
        const data = await this.ChatTask.deleteMany({ taskId });
        if (data) {
          return { status: true }
        } else {
          return {status: false, error: "Couldn't create ChatTask" };
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    createTask = async (details: IChatTask) => {
      try {
        const data = await this.ChatTask.create(details);
        if (data) {
          return {status: true, data: new ChatTaskDto(data)};
        } else {
          return {status: false, error: "Couldn't create ChatTask" };
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    updateTask = async (id: string, details: Partial<IChatTask>) => {
      try {
        const data = await this.ChatTask.findByIdAndUpdate(id, details, { new: true });
        if (data) {
          return {status: true, data: new ChatTaskDto(data)};
        } else {
          return {status: false, error: "Couldn't update ChatTask"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }
  
    checkIfExist = async (details: Partial<IChatTask>) => {
      try {
        const data = await this.ChatTask.findOne(details);
        if (data) {
          return {status: true, data: new ChatTaskDto(data)};
        } else {
          return {status: false, error: "Couldn't update ChatTask"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }

    getAllTask = async (details: Partial<IChatTask>, option: { page: number; limit: number; }) => {
      try {
        const data = await this.ChatTask.paginate(details, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: new MultipleChatTaskDto({ 
              chats : data.docs,
              totalChats: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
    
    getAllTasks = async (details: Partial<IChatTask>[]) => {
      try {
        const data = await this.ChatTask.find({ $or: details });
        if (data) {
          return { status: true, data: data.map((service) => new ChatTaskDto(service)) };
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
    getAllTasksInPages = async (details: Partial<IChatTask>[], option: { page: number; limit: number; }) => {
      try {
        const data = await this.ChatTask.paginate(details, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: new MultipleChatTaskDto({ 
              chats : data.docs,
              totalChats: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
  
    getAllChatTaskByWorkStatus = async  (status: 'free' | 'engage', option: { page: number; limit: number; }) => {
      try {
        const currentTime = Date.parse((new Date()).toISOString())
        const data = status === 'free' ?
            await this.ChatTask.paginate({ work_timeout: { $lt: currentTime }, subscriptionDate: { $lt: currentTime } }, {...option, sort: {_id: -1}})
            :
            await this.ChatTask.paginate({ work_timeout: { $gt: currentTime }, subscriptionDate: { $lt: currentTime } }, {...option, sort: {_id: -1}})
  
        if (data) {
          return {status: true,
            data: new MultipleChatTaskDto({ 
              chats : data.docs,
              totalChats: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
  
    deleteTask = async (requestId: string) => {
      try {
        const data = await this.ChatTask.findByIdAndRemove(requestId);
        if (data) {
          return {status: true, data: new ChatTaskDto(data)};
        } else {
          return {status: false, error: "Couldn't create user"};
        }
      } catch (error) {
          defaultLogger.error(error);
          return {status: false, error };
      }
    }
}

export default ChatTaskModel;