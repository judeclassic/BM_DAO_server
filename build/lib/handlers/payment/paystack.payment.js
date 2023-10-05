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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../constant/config"));
const logger_1 = require("../../modules/logger");
const { paystackSecretKey } = config_1.default.payment;
class PayStackRepo {
    constructor() {
        this.createBankRecipient = ({ type, name, account_number, bank_code }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post("https://api.paystack.co/transferrecipient", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${paystackSecretKey}`,
                    },
                    data: {
                        type,
                        name,
                        account_number,
                        bank_code,
                        currency: "NGN",
                    },
                });
                const { status, data, message } = response.data;
                if (!status)
                    throw message;
                return data;
            }
            catch (err) {
                logger_1.defaultLogger.error(err);
                throw err;
            }
        });
        this.transfer = ({ source, amount, recipient, reason }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transerInfo = yield axios_1.default.post(`https://api.paystack.co/transfer`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${paystackSecretKey}`,
                    },
                    data: { source, amount, recipient, reason },
                });
                const { status, data, message } = transerInfo.data;
                if (!status)
                    throw message;
                return data;
            }
            catch (err) {
                throw err;
            }
        });
        this.withdrawMoney = ({ bank_code, amount, account_number, account_name }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const source = "balance";
                const type = "nuban";
                const reason = "bakely payout";
                const bankData = yield this.createBankRecipient({
                    type,
                    name: account_name,
                    account_number,
                    bank_code,
                });
                const { recipient_code } = bankData;
                const transferInfo = yield this.transfer({
                    source,
                    amount,
                    recipient: recipient_code,
                    reason,
                });
                return transferInfo;
            }
            catch (err) {
                logger_1.defaultLogger.error(err);
                return err;
            }
        });
        this.getListOfBanks = () => __awaiter(this, void 0, void 0, function* () {
            const country = "nigeria";
            try {
                const response = yield axios_1.default.get(`https://api.paystack.co/bank?country=${country}`);
                const { data, status, message } = response.data;
                if (!status)
                    throw message;
                return data;
            }
            catch (err) {
                logger_1.defaultLogger.error(err);
                return err;
            }
        });
        this.resolveAccount = ({ bankCode, accountNumber }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.PAYSTACK_SK_TEST}`
                    },
                });
                const { data, status, message } = yield response.data;
                return { data, status, message };
            }
            catch (error) {
                return { data: null, status: false };
            }
        });
        this.name = 'PAYSTACK';
    }
}
exports.default = PayStackRepo;
