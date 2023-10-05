"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransactionDto {
    constructor(transaction) {
        this.toResponse = () => {
            return {
                _id: this._id,
                userName: this.userName,
                emailAddress: this.emailAddress,
                userId: this.userId,
                updatedAt: this.updatedAt ? new Date(this.updatedAt) : undefined,
                createdAt: this.createdAt ? new Date(this.createdAt) : undefined,
                transactionType: this.transactionType,
                transactionStatus: this.transactionStatus,
                isVerified: this.isVerified
            };
        };
        this._id = transaction._id;
        this.userName = transaction.userName;
        this.emailAddress = transaction.emailAddress;
        this.userId = transaction.userId;
        this.updatedAt = transaction.updatedAt;
        this.createdAt = transaction.createdAt;
        this.transactionStatus = transaction.transactionStatus;
        this.transactionType = transaction.transactionType;
        this.isVerified = transaction.isVerified;
    }
}
exports.default = TransactionDto;
