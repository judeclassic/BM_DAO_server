"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
//User Schema
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const transaction_dto_1 = require("../../../../types/dtos/transaction.dto");
const transaction_response_1 = require("../../../../types/interfaces/response/transaction.response");
const logger_1 = require("../../logger");
const TransactionSchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    userId: {
        type: String
    },
    updatedAt: {
        type: String
    },
    createdAt: {
        type: String
    },
    transactionType: {
        type: String,
        enum: Object.values(transaction_response_1.TransactionTypeEnum)
    },
    amount: {
        type: Number
    },
    transactionStatus: {
        type: String,
        enum: Object.values(transaction_response_1.TransactionStatusEnum)
    },
    isVerified: {
        type: Boolean,
    },
});
TransactionSchema.plugin(mongoose_paginate_v2_1.default);
const Transaction = (0, mongoose_1.model)("Transaction", TransactionSchema);
class TransactionModel {
    constructor() {
        this.saveTransaction = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Transaction.create(details);
                if (data) {
                    return { status: true, data: new transaction_dto_1.TransactionDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't create transaction" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateTransaction = (id, details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Transaction.findByIdAndUpdate(id, details, { new: true });
                if (data) {
                    return { status: true, data: new transaction_dto_1.TransactionDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't update transaction" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.checkIfExist = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Transaction.findOne(details);
                if (data) {
                    return { status: true, data: new transaction_dto_1.TransactionDto(data) };
                }
                else {
                    return { status: false, error: `Can't find Details` };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.getTransactions = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Transaction.paginate(details, option);
                if (data) {
                    return {
                        status: true,
                        data: new transaction_dto_1.MultipleTransactionDto({
                            transactions: data.docs,
                            totalTransactions: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        })
                    };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.Transaction = Transaction;
    }
}
exports.default = TransactionModel;
