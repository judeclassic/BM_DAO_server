import ChatterUserServiceDto, { MultipleChatterUserServiceDto } from "../../../../../dtos/service/chatters.dto";
import { IChatterSocialHandle, IChatterUserService } from "../../../../response/services/chatter/chatter.response";


interface IChatterUserServiceModelRepository{

    createUserService: (details: IChatterUserService) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;

    updateUserService: (id : string, details : Partial<IChatterUserService>) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;
    
    updateCreatedAnalytics: (userId: string) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;

    updateCompletedAnalytics: (userId: string) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;

    updateCancelAnalytics: (userId: string) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;

    checkIfExist: (details : Partial<IChatterUserService>) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;

    updateSocialHandle: (details : Partial<IChatterUserService>, handles: IChatterSocialHandle) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;

    getAllUserService: (details : Partial<IChatterUserService>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatterUserServiceDto }>;

    getAllUserServiceByWorkStatus: (status: 'free' | 'engage', option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatterUserServiceDto }>;

    countUsersInPlatform: (details : Partial<IChatterUserService>) => 
        Promise<{status: boolean, error?: string | unknown, data?: number }>;

    getAllUserServices: (details : Partial<IChatterUserService>[]) => 
        Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto[] }>;

    getAllUserServicesInPages: (details : Partial<IChatterUserService>[], option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleChatterUserServiceDto }>;

    deleteUserService: (requestId: string) => Promise<{status: boolean, error?: string | unknown, data?: ChatterUserServiceDto }>;
}

export default IChatterUserServiceModelRepository;