import { ITransaction, TransactionTypeEnum, TransactionStatusEnum, IMultipleTransaction } from '../interfaces/response/transaction.response'


export class TransactionDto implements ITransaction  {
  public _id?: string;
  public name: string;
  public userId: string;
  public updatedAt?: Date;
  public createdAt?: Date;
  public transactionType: TransactionTypeEnum;
  public amount: number;
  public transactionStatus?: TransactionStatusEnum;
  public isVerified?: boolean;

  constructor(transaction: ITransaction) {
    this._id = transaction._id;
    this.name = transaction.name;
    this.userId = transaction.userId;
    this.amount = transaction.amount;
    this.updatedAt = transaction.updatedAt;
    this.createdAt = transaction.createdAt;
    this.transactionStatus = transaction.transactionStatus;
    this.transactionType = transaction.transactionType;
    this.isVerified = transaction.isVerified;
  }

  get getResponse(): ITransaction {
    return {
      _id: this._id,
      name: this.name,
      amount: this.amount,
      userId: this.userId,
      updatedAt: this.updatedAt ? new Date(this.updatedAt): undefined,
      createdAt: this.createdAt ? new Date(this.createdAt): undefined,
      transactionType: this.transactionType,
      transactionStatus: this.transactionStatus,
      isVerified: this.isVerified
    } as ITransaction
  }
}
export class MultipleTransactionDto implements IMultipleTransaction {
  transactions: TransactionDto[];
  totalTransactions: number;
  hasNextPage: boolean;

  constructor (multipleTransactions: IMultipleTransaction) {
    this.transactions = multipleTransactions.transactions.map((tran) => new TransactionDto(tran));
    this.totalTransactions = multipleTransactions.totalTransactions;
    this.hasNextPage = multipleTransactions.hasNextPage;
  }

  get getResponse() {
    return {
      transactions: this.transactions.map((tran) => tran.getResponse ),
      totalTransactions: this.totalTransactions,
      hasNextPage: this.hasNextPage
    } as IMultipleTransaction;
  }
}