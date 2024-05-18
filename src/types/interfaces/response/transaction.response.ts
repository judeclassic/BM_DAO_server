export enum TransactionTypeEnum {
  FUNDING = 'FUNDING',
  WITHDRAWAL = 'WITHDRAWAL',
  REFERRAL = "REFERRAL",
  TASK_CREATION = "TASK_CREATION",
  RAIDER_SUBSCRIPTION = "RAIDER_SUBSCRIPTION",
  CHATTER_SUBSCRIPTION = "CHATTER_SUBSCRIPTION",
  MODERATOR_PAYMENT = "MODERATOR_PAYMENT"
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