import { ITransaction } from "../../../response/transaction.response";


interface ITransactionModelInterface{

    savePayoutToDB: (details: ITransaction) => Promise<{status: boolean, error?: string | unknown, data?: ITransaction }>;

    updatePayoutDetailWithIdToDB: (id : string, details : Partial<ITransaction>) => Promise<{status: boolean, error?: string | unknown, data?: ITransaction }>;

    updatePayoutDetailToDB: (searchable : Partial<ITransaction>, details : Partial<ITransaction>) => Promise<{status: boolean, error?: string | unknown, data?: ITransaction }>;

    checkIfExist: (details : Partial<ITransaction>) => Promise<{status: boolean, error?: string | unknown, data?: ITransaction }>;

    SearchAllPayout: (searchable: Partial<ITransaction>[], data: {page: number, limit: number} ) => Promise<{status: boolean, error?: string | unknown, data?: {payouts: ITransaction[], totalPayouts: number, hasNextPage: boolean} }>;

    getSinglePayoutWithUserId: (userId: string) => Promise<{status: boolean, error?: string | unknown, data?: ITransaction }>;

    getAllPayouts: (searchable: Partial<ITransaction>, data: {page: number, limit: number} ) => Promise<{status: boolean, error?: string | unknown, data?: {payouts: ITransaction[], totalPayouts: number, hasNextPage: boolean} }>;

    deletePayoutDetailFromDB: (id: string) => Promise<{status: boolean, error?: string | unknown, data?: ITransaction }>;
}

export default ITransactionModelInterface;