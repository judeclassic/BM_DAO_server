import axios from "axios";
import config from "../../constant/config";
import { defaultLogger } from '../../modules/logger';

const { paystackSecretKey } = config.payment;


class PayStackRepo {
    name: string;

    constructor () {
      this.name = 'PAYSTACK';
    }

    private createBankRecipient = async ({ type, name, account_number, bank_code }:{ type: string, name: string, account_number: string, bank_code: number}) => {
        try {
          const response = await axios.post("https://api.paystack.co/transferrecipient", {
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
      
          if (!status) throw message;
      
          return data;
        } catch (err) {
          defaultLogger.error(err)
          throw err;
        }
    };

    private transfer = async ({ source, amount, recipient, reason }:{ source: string, amount: number, recipient: string, reason: string }) => {
        try {
          const transerInfo = await axios.post(`https://api.paystack.co/transfer`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${paystackSecretKey}`,
            },
            data: { source, amount, recipient, reason },
          });
      
          const { status, data, message } = transerInfo.data;
      
          if (!status) throw message;
          return data;
        } catch (err) {
          throw err;
        }
    };

    withdrawMoney = async ({ bank_code, amount, account_number, account_name }:{ bank_code: number, amount: number, account_number: string, account_name: string }) => {
        try {
            const source = "balance";
            const type = "nuban";
            const reason = "bakely payout";

            const bankData = await this.createBankRecipient({
                type,
                name: account_name,
                account_number,
                bank_code,
            });

            const { recipient_code } = bankData;
        
            const transferInfo = await this.transfer({
                source,
                amount,
                recipient: recipient_code,
                reason,
            });

            return transferInfo;
        } catch (err) {
            defaultLogger.error(err);
            return err;
        }
    }

    getListOfBanks = async () => {
          const country = "nigeria";

          try {
            const response = await axios.get(
              `https://api.paystack.co/bank?country=${country}`
            );
    
            const { data, status, message } = response.data;
            if (!status) throw message;

            return data;
        } catch (err) {
            defaultLogger.error(err);
            return err;
        }
    }

    resolveAccount = async ({ bankCode, accountNumber }: { bankCode: number, accountNumber: string }) => {
  
      try {
        const response = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.PAYSTACK_SK_TEST}`
            },
          }
        );
  
        const { data, status, message } = await response.data;
        return { data, status, message };
      } catch (error) {
        return {data: null, status: false};
      }
    };
}

export default PayStackRepo;