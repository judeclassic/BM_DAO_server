import { ChatterTaskDto, MultipleChatterTaskDto } from "../../../../../dtos/task/chatters.dto";
import { IChatterTask } from "../../../../response/task/chatter_task.response";


interface IChatterTaskModelRepository{

    saveTaskToDB: (details: Partial<IChatterTask>) => Promise<{status: boolean, error?: string | unknown, data?: ChatterTaskDto }>;

    updateTaskDetailToDB: (id : string, details : Partial<IChatterTask>) => Promise<{status: boolean, error?: string | unknown, data?: ChatterTaskDto }>;

    checkIfExist: (details : Partial<IChatterTask>) => Promise<{status: boolean, error?: string | unknown, data?: ChatterTaskDto }>;

    getAllTask: (details : Partial<IChatterTask>, option: { page: number, limit: number }) => Promise<{status: boolean, error?: string | unknown, data?: MultipleChatterTaskDto }>;

    getChatTask: (details : Partial<IChatterTask>,) => Promise<{status: boolean, error?: string | unknown, data?: any }>;

    getActiveTask: (details : Partial<IChatterTask>, option: { page: number, limit: number }) => Promise<{status: boolean, error?: string | unknown, data?: MultipleChatterTaskDto }>;

    getFutureTask: (details : Partial<IChatterTask>, option: { page: number, limit: number }) => Promise<{status: boolean, error?: string | unknown, data?: MultipleChatterTaskDto }>;
}
 
export default IChatterTaskModelRepository;