import UserDto, { UnSecureUserResponseInterface } from "../../../../dtos/user.dto";
import { ServiceAccountTypeEnum } from "../../../response/services/enums";
import { IUser } from "../../../response/user.response";


interface IUserModelRepository{
    updateUpdatedAnalytics: (userId: string, type: ServiceAccountTypeEnum) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    updateCompletedAnalytics: (userId: string, type: ServiceAccountTypeEnum) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    saveUserToDB: (details: Partial<IUser>) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    updateUserDetailToDB: (id : string, details : Partial<IUser>) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    checkIfReferalExist: (details : Partial<IUser['referal']>) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    getReferals: (details : Partial<IUser['referal']>) => Promise<{status: boolean, error?: string | unknown, data?: UnSecureUserResponseInterface[] }>;

    checkIfExist: (details : Partial<IUser>) => Promise<{ status: boolean, error?: string | unknown, data?: UserDto }>;
}

export default IUserModelRepository;