import UserDto, { UnSecureUserResponseInterface } from "../../../../dtos/user.dto";
import { IUser } from "../../../response/user.response";


interface IUserModelRepository{

    saveUserToDB: (details: Partial<IUser>) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    updateUserDetailToDB: (id : string, details : Partial<IUser>) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    checkIfReferalExist: (details : Partial<IUser['referal']>) => Promise<{status: boolean, error?: string | unknown, data?: UserDto }>;

    getReferals: (details : Partial<IUser['referal']>) => Promise<{status: boolean, error?: string | unknown, data?: UnSecureUserResponseInterface[] }>;

    checkIfExist: (details : Partial<IUser>) => Promise<{ status: boolean, error?: string | unknown, data?: UserDto }>;
}

export default IUserModelRepository;