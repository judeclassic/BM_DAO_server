import { MultipleRaiderTaskDto, RaiderTaskDto } from "../../../../../dtos/task/raiders.dto";
import { IRaiderTask } from "../../../../response/task/raider_task.response";


interface IRaiderTaskModelRepository{

    saveTaskToDB: (details: Partial<IRaiderTask>) => Promise<{status: boolean, error?: string | unknown, data?: RaiderTaskDto }>;

    updateTaskDetailToDB: (id : string, details : Partial<IRaiderTask>) => Promise<{status: boolean, error?: string | unknown, data?: RaiderTaskDto }>;

    checkIfExist: (details : Partial<IRaiderTask>) => Promise<{status: boolean, error?: string | unknown, data?: RaiderTaskDto }>;

    getAllTask: (details : Partial<IRaiderTask>, option: { page: number, limit: number }) => Promise<{status: boolean, error?: string | unknown, data?: MultipleRaiderTaskDto }>;

    getActiveTask: (details : Partial<IRaiderTask>, option: { page: number, limit: number }) => Promise<{status: boolean, error?: string | unknown, data?: MultipleRaiderTaskDto }>;

    getFutureTask: (details : Partial<IRaiderTask>, option: { page: number, limit: number }) => Promise<{status: boolean, error?: string | unknown, data?: MultipleRaiderTaskDto }>;
}

export default IRaiderTaskModelRepository;