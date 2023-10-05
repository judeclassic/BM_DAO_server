"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleTransactionDto = exports.TransactionDto = void 0;
class TransactionDto {
    constructor(transaction) {
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
    get getResponse() {
        return {
            _id: this._id,
            name: this.name,
            amount: this.amount,
            userId: this.userId,
            updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
            createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
            transactionType: this.transactionType,
            transactionStatus: this.transactionStatus,
            isVerified: this.isVerified
        };
    }
}
exports.TransactionDto = TransactionDto;
class MultipleTransactionDto {
    constructor(multipleTransactions) {
        this.transactions = multipleTransactions.transactions.map((tran) => new TransactionDto(tran));
        this.totalTransactions = multipleTransactions.totalTransactions;
        this.hasNextPage = multipleTransactions.hasNextPage;
    }
    get getResponse() {
        return {
            transactions: this.transactions.map((tran) => tran.getResponse),
            totalTransactions: this.totalTransactions,
            hasNextPage: this.hasNextPage
        };
    }
}
exports.MultipleTransactionDto = MultipleTransactionDto;
