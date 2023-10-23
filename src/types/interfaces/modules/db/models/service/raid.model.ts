import { RaidDto, MultipleRaidDto } from "../../../../../dtos/service/raids.dto";
import { IRaid } from "../../../../response/services/raid.response";


interface IRaidModelRepository{
    deleteAllRaids: (arg0: { taskId: string; }) => Promise<{status: boolean, error?: string | unknown, data?: RaidDto }>;

    createRaid: (details: IRaid) => Promise<{status: boolean, error?: string | unknown, data?: RaidDto }>;

    updateRaid: (id : string, details : Partial<IRaid>) => Promise<{status: boolean, error?: string | unknown, data?: RaidDto }>;

    checkIfExist: (details : Partial<IRaid>) => Promise<{status: boolean, error?: string | unknown, data?: RaidDto }>;

    getAllRaid: (details : Partial<IRaid>, option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleRaidDto }>;

    getAllRaidByWorkStatus: (status: 'free' | 'engage', option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleRaidDto }>;

    getAllRaids: (details : Partial<IRaid>[]) => 
        Promise<{status: boolean, error?: string | unknown, data?: RaidDto[] }>;

    getAllRaidsInPages: (details : Partial<IRaid>[], option: { page: number, limit: number }) => 
        Promise<{status: boolean, error?: string | unknown, data?: MultipleRaidDto }>;

    deleteRaid: (requestId: string) => Promise<{status: boolean, error?: string | unknown, data?: RaidDto }>;
}

export default IRaidModelRepository;