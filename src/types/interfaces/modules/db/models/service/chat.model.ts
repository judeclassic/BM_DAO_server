import { ChatTaskDto, MultipleChatTaskDto } from "../../../../../dtos/service/chats.dto";
import { IChatTask, TaskStatusStatus } from "../../../../response/services/chatter/chat_cliamable.response";


interface IChatTaskModelRepository{
    deleteAllTask: (arg0: { taskId: string; }) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    createTask: (details: IChatTask) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    updateTask: (id : string, details : Partial<IChatTask>) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    updateTaskProof: (id : string, proof: any, status: TaskStatusStatus) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    checkIfExist: (details : Partial<IChatTask>) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    getAllTask: (details : Partial<IChatTask>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatTaskDto }>;

    getAllStartedTask: (details : Partial<IChatTask>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatTaskDto }>;

    getSingleTask: (details : Partial<IChatTask>,) => 
        Promise<{status: boolean, error?: string | unknown, data?: any }>;

    getTotalStatusTask: (details : Partial<IChatTask>,) => 
        Promise<{status: boolean, error?: string | unknown, data?: any }>;

    getAllChatTaskByWorkStatus: (status: 'free' | 'engage', option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatTaskDto }>;

    getAllTasks: (details : Partial<IChatTask>[]) => 
        Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto[] }>;

    getAllTasksInPages: (details : Partial<IChatTask>[], option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatTaskDto }>;

    getAvailableTaskPerDay: (details : Partial<IChatTask>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: any }>;

    getAllTaskByStatus: (details : Partial<IChatTask>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: any }>;

    countAvailbleChatPerDay: (details : Partial<IChatTask>) => 
        Promise<{status: boolean, error?: string | unknown, data?: any }>;

    getTaskForModerator: (moderatorId : any) => 
        Promise<{status: boolean, error?: string | unknown, data?: any }>;

    deleteTask: (requestId: string) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;
}

export default IChatTaskModelRepository;