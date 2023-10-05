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
const logger_1 = require("../../modules/logger");
const paystack_payment_1 = __importDefault(require("./paystack.payment"));
class PaymentRepo {
    constructor() {
        this.validateBankInformation = ({ bankCode, accountNumber }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, status } = yield this.paystackPayment.resolveAccount({ bankCode, accountNumber });
                return { data, status };
            }
            catch (err) {
                logger_1.defaultLogger.error(err);
                return { data: null, status: false };
            }
        });
        this.withdrawMoneyForNigerian = ({ bank_code, amount, account_number, account_name }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transferInfo = yield this.paystackPayment.withdrawMoney({ bank_code, amount, account_number, account_name });
                return transferInfo;
            }
            catch (err) {
                logger_1.defaultLogger.error(err);
                return err;
            }
        });
        this.getBankListOfBanks = () => __awaiter(this, void 0, void 0, function* () {
            const listOfBanks = yield this.paystackPayment.getListOfBanks();
            return listOfBanks;
        });
        this.CUT_BAKELY_PERCENTAGE = (amount, devileryPrice) => {
            return ((amount - devileryPrice) / 10) * 9;
        };
        this.paystackPayment = new paystack_payment_1.default();
    }
}
exports.default = PaymentRepo;
