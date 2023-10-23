export enum TransactionTypeEnum {
    FUNDING = 'FUNDING',
    WITHDRAWAL = 'WITHDRAWAL',
    REFERRAL = "REFERRAL",
}

export enum TransactionStatusEnum {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"

}

export interface ITransaction {
    _id?: string;
    name: string;
    userId: string;
    updatedAt?: Date;
    createdAt?: Date;
    transactionType: TransactionTypeEnum;
    transactionStatus?: TransactionStatusEnum;
    amount: number;
    isVerified?: boolean;
}

export interface IMultipleTransaction {
    transactions: ITransaction[];
    totalTransactions: number;
    hasNextPage: boolean;
}