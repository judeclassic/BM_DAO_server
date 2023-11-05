"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatusEnum = exports.TransactionTypeEnum = void 0;
var TransactionTypeEnum;
(function (TransactionTypeEnum) {
    TransactionTypeEnum["FUNDING"] = "FUNDING";
    TransactionTypeEnum["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionTypeEnum["REFERRAL"] = "REFERRAL";
    TransactionTypeEnum["TASK_CREATION"] = "TASK_CREATION";
    TransactionTypeEnum["RAIDER_SUBSCRIPTION"] = "RAIDER_SUBSCRIPTION";
})(TransactionTypeEnum = exports.TransactionTypeEnum || (exports.TransactionTypeEnum = {}));
var TransactionStatusEnum;
(function (TransactionStatusEnum) {
    TransactionStatusEnum["PENDING"] = "PENDING";
    TransactionStatusEnum["CANCELLED"] = "CANCELLED";
    TransactionStatusEnum["COMPLETED"] = "COMPLETED";
})(TransactionStatusEnum = exports.TransactionStatusEnum || (exports.TransactionStatusEnum = {}));
