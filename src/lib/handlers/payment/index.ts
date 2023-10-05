import PaymentRepoInterface from "../../../types/interfaces/modules/payment";
import { defaultLogger } from "../../modules/logger";
import PayStackRepo from "./paystack.payment";

class PaymentRepo implements PaymentRepoInterface {
    paystackPayment: PayStackRepo;

    constructor () {
        this.paystackPayment = new PayStackRepo();
    }

    validateBankInformation = async ({ bankCode, accountNumber }: { accountNumber: string; bankCode: number; }) => {
        try {
            const { data, status } = await this.paystackPayment.resolveAccount({ bankCode, accountNumber });

            return { data, status };
        } catch (err) {
            defaultLogger.error(err);
            return { data: null, status: false };
        }
    }

    withdrawMoneyForNigerian = async ({ bank_code, amount, account_number, account_name }:{ bank_code: number, amount: number, account_number: string, account_name: string }) => {
        try {
            const transferInfo = await this.paystackPayment.withdrawMoney({ bank_code, amount, account_number, account_name });

            return transferInfo;
        } catch (err) {
            defaultLogger.error(err);
            return err;
        }
    }

    getBankListOfBanks = async () => {
        const listOfBanks = await this.paystackPayment.getListOfBanks();
        return listOfBanks;
    }

    CUT_BAKELY_PERCENTAGE = (amount: number, devileryPrice: number) => {
        return ((amount - devileryPrice)/10) * 9;
    }
}

export default PaymentRepo;