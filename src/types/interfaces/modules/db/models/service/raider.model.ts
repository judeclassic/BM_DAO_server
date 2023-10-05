import UserServiceDto, { MultipleUserServiceDto } from "../../../../../dtos/service/raiders.dto";
import { IRaiderUserService } from "../../../../response/services/raider.response";


interface IRaiderServiceModelRepository{

    createUserService: (details: IRaiderUserService) => Promise<{status: boolean, error?: string | unknown, data?: UserServiceDto }>;

    updateUserService: (id : string, details : Partial<IRaiderUserService>) => Promise<{status: boolean, error?: string | unknown, data?: UserServiceDto }>;

    checkIfExist: (details : Partial<IRaiderUserService>) => Promise<{status: boolean, error?: string | unknown, data?: UserServiceDto }>;

    getAllUserService: (details : Partial<IRaiderUserService>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleUserServiceDto }>;

    getAllUserServiceByWorkStatus: (status: 'free' | 'engage', option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleUserServiceDto }>;

    countUsersInPlatform: (details : Partial<IRaiderUserService>) => 
        Promise<{status: boolean, error?: string | unknown, data?: number }>;

    getAllUserServices: (details : Partial<IRaiderUserService>[]) => 
        Promise<{status: boolean, error?: string | unknown, data?: UserServiceDto[] }>;

    getAllUserServicesInPages: (details : Partial<IRaiderUserService>[], option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleUserServiceDto }>;

    deleteUserService: (requestId: string) => Promise<{status: boolean, error?: string | unknown, data?: UserServiceDto }>;
}

export default IRaiderServiceModelRepository;