import ModeratorUserServiceDto, { MultipleModeratorServiceDto } from "../../../../../dtos/service/moderators.dto";
import { IModeratorUserService } from "../../../../response/services/moderator.response";
import { IRaiderUserService } from "../../../../response/services/raider.response";


interface IModeratorServiceModelRepository{

    createUserService: (details: IModeratorUserService) => Promise<{status: boolean, error?: string | unknown, data?: ModeratorUserServiceDto }>;

    updateUserService: (id : string, details : Partial<IModeratorUserService>) => Promise<{status: boolean, error?: string | unknown, data?: ModeratorUserServiceDto }>;

    checkIfExist: (details : Partial<IModeratorUserService>) => Promise<{status: boolean, error?: string | unknown, data?: ModeratorUserServiceDto }>;

    getAllUserService: (details : Partial<IModeratorUserService>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleModeratorServiceDto }>;

    getAllUserServiceByWorkStatus: (status: 'free' | 'engage', option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleModeratorServiceDto }>;

    countUsersInPlatform: (details : Partial<IModeratorUserService>) => 
        Promise<{status: boolean, error?: string | unknown, data?: number }>;

    getAllUserServices: (details : Partial<IModeratorUserService>[]) => 
        Promise<{status: boolean, error?: string | unknown, data?: ModeratorUserServiceDto[] }>;

    getAllUserServicesInPages: (details : Partial<IModeratorUserService>[], option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleModeratorServiceDto }>;

    deleteUserService: (requestId: string) => Promise<{status: boolean, error?: string | unknown, data?: ModeratorUserServiceDto }>;
}

export default IModeratorServiceModelRepository;