import { ChatTaskDto, MultipleChatTaskDto } from "../../../../../dtos/service/chats.dto";
import { IChatTask } from "../../../../response/services/chatter/chat_cliamable.response";
import { IRaid } from "../../../../response/services/raid.response";


interface IChatTaskModelRepository{
    deleteAllTask: (arg0: { taskId: string; }) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    createTask: (details: IChatTask) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    updateTask: (id : string, details : Partial<IRaid>) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    checkIfExist: (details : Partial<IRaid>) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;

    getAllTask: (details : Partial<IChatTask>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatTaskDto }>;

    getAllChatTaskByWorkStatus: (status: 'free' | 'engage', option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatTaskDto }>;

    getAllTasks: (details : Partial<IChatTask>[]) => 
        Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto[] }>;

    getAllTasksInPages: (details : Partial<IRaid>[], option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatTaskDto }>;

    deleteTask: (requestId: string) => Promise<{status: boolean, error?: string | unknown, data?: ChatTaskDto }>;
}

export default IChatTaskModelRepository;