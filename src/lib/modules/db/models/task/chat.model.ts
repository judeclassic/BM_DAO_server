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
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "ChatterTask"
  },
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
  proofs: {
    type : [String]
  },
  moderatorId: String,
  moderatorExpiredTime: Number,
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

    updateTaskProof = async (id: string, proof: any, status: TaskStatusStatus) => {
      try {
        const data = await this.ChatTask.findOne({_id: id});
        if (data) {
          data.proofs = ["Alice"]
          data.taskStatus = status
          await data.save()

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

    getAllStartedTask = async (details: Partial<IChatTask>, option: { page: number; limit: number; }) => {
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

    getSingleTask = async (details: Partial<IChatTask>,) => {
      try {
        const data = await this.ChatTask.findOne(details);
        if (data) {
          return {status: true, data: data};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }

    getTotalStatusTask = async (details: Partial<IChatTask>,) => {
      try {
        const data = await this.ChatTask.countDocuments(details);
        if (data) {
          return {status: true, data: data};
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

    getAvailableTaskPerDay = async (details: Partial<IChatTask>, option: { page: number, limit: number }) => {
      try {
        const date = (new Date()).toISOString();
        const timeLine = Date.parse(date);

        // Get the current date
        const now = new Date();

        // Get the start of the day
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const startOfDayISO = startOfDay.toISOString();
        const StartTimeLine = Date.parse(startOfDayISO);

        // Get the end of the day
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const endOfDayISO = endOfDay.toISOString();
        const endTimeLine = Date.parse(endOfDayISO);

        const data = await this.ChatTask.paginate({ startTime: { $lt: endTimeLine }, endTime: { $gt: timeLine }, ...details }, {...option, sort: {_id: -1}});
        if (data) {
          return {status: true,
            data: {
              chats : data.docs,
              totalChats: data.totalDocs,
              hasNextPage: data.hasNextPage
            }
          };
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }

    getAllTaskByStatus = async (details: Partial<IChatTask>, option: { page: number, limit: number }) => {
      try {
        const skip = (option.page - 1) * option.limit;
        const totalData = await this.ChatTask.countDocuments(details);

        const data = await this.ChatTask.find(details).populate("taskId").skip(skip).limit(option.limit);

        if (data) {
          return {status: true,
            data: {
              chats : data,
              totalChats: totalData,
              hasNextPage: true
            }
          };
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }

    countAvailbleChatPerDay = async (details: Partial<IChatTask>,) => {
      const date = (new Date()).toISOString();
        const timeLine = Date.parse(date);

        // Get the current date
        const now = new Date();

        // Get the start of the day
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const startOfDayISO = startOfDay.toISOString();
        const StartTimeLine = Date.parse(startOfDayISO);

        // Get the end of the day
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const endOfDayISO = endOfDay.toISOString();
        const endTimeLine = Date.parse(endOfDayISO);

        const data = await this.ChatTask.countDocuments({ startTime: { $lt: endTimeLine }, endTime: { $gt: timeLine }, ...details });

        if (data) {
          return {status: true, data: data};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
    }
    
    getTaskForModerator = async (moderatorId: any) => {
      try {
        const date = (new Date()).toISOString();
        const timeLine = Date.parse(date);

        const checkmoderatorTask = await this.ChatTask.find({moderatorId, taskStatus: TaskStatusStatus.COMPLETED, moderatorExpiredTime: { $gt: timeLine }}).populate("taskId")
        if (checkmoderatorTask.length > 0) {
          const totaltask = await this.ChatTask.countDocuments({moderatorId, taskStatus: TaskStatusStatus.COMPLETED, moderatorExpiredTime: { $gt: timeLine }})
          return {status: true,
            data: {
              tasks : checkmoderatorTask,
              totaltask: totaltask,
            }
          };
        }

        const chats = await this.ChatTask.find({taskStatus: TaskStatusStatus.COMPLETED, $or: [
          { moderatorExpiredTime: { $lt: timeLine } },
          { moderatorExpiredTime: { $exists: false } }
      ]}).sort({ createdAt: -1 }).limit(10);

        const currentDate = new Date();
        const updatedDate = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000);
        const updatedISOString = updatedDate.toISOString();
        const moderatorExpiredTime = Date.parse(updatedISOString);

        const updatedChats = chats.map(chat => {
          chat.moderatorId = moderatorId;
          chat.moderatorExpiredTime = moderatorExpiredTime; // Update to desired price
          return chat.save();
        });

        await Promise.all(updatedChats);

        const data = await this.ChatTask.find({moderatorId, taskStatus: TaskStatusStatus.COMPLETED,  moderatorExpiredTime: { $lt: timeLine }}).sort({ createdAt: -1 }).limit(10).populate("taskId");
        const totaltask = await this.ChatTask.countDocuments({moderatorId, taskStatus: TaskStatusStatus.COMPLETED,  moderatorExpiredTime: { $lt: timeLine }}).sort({ createdAt: -1 }).limit(10);

        if (data) {
          return {status: true,
            data: {
              tasks : checkmoderatorTask,
              totaltask: totaltask,
            }
          };
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