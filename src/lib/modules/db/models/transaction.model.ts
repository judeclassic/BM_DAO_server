//@ts-check
//User Schema
import { Schema, model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
import { MultipleTransactionDto, TransactionDto } from '../../../../types/dtos/transaction.dto';
import { ITransaction, TransactionStatusEnum, TransactionTypeEnum } from '../../../../types/interfaces/response/transaction.response';
import { defaultLogger } from '../../logger';

const TransactionSchema = new Schema<ITransaction>({
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
    enum: Object.values(TransactionTypeEnum)
  },
  amount: {
    type: Number
  },
  transactionStatus: {
    type: String,
    enum: Object.values(TransactionStatusEnum)
  },
  isVerified: {
    type: Boolean,
  },
});

TransactionSchema.plugin(mongoosePaginate);

const Transaction = model<ITransaction, PaginateModel<ITransaction>>("Transaction", TransactionSchema)

class  TransactionModel {
  Transaction: typeof Transaction;

    constructor() {
        this.Transaction =  Transaction;
    }

    saveTransaction = async (details: Partial<ITransaction>) => {
        try {
            const data = await this.Transaction.create(details);
            if (data) {
              return {status: true, data: new TransactionDto(data)};
            } else {
              return {status: false, error: "Couldn't create transaction"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    updateTransaction = async (id : string, details : Partial<ITransaction>) => {
        try {
            const data = await this.Transaction.findByIdAndUpdate(id, details, {new: true});
            if (data) {
              return {status: true, data: new TransactionDto(data)};
            } else {
              return {status: false, error: "Couldn't update transaction"};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error };
        }
    }

    checkIfExist = async (details : Partial<ITransaction>) => {
        try {
            const data = await this.Transaction.findOne(details);
            if (data) {
              return {status: true, data: new TransactionDto(data)};
            }else {
                return {status: false, error: `Can't find Details`};
            }
        } catch (error) {
            defaultLogger.error(error);
            return {status: false, error }
        }
    }

    getTransactions = async (details: Partial<ITransaction>, option: { page: number; limit: number; }) => {
      try {
        const data = await this.Transaction.paginate(details, {...option, sort: {_id: -1}});
        if (data) {
          return {
            status: true,
            data: new MultipleTransactionDto({ 
              transactions : data.docs,
              totalTransactions: data.totalDocs,
              hasNextPage: data.hasNextPage
            })};
        } else {
          return {status: false, error: "Couldn't get store details"};
        }
      } catch (error) {
          return {status: false, error };
      }
    }
}

export default TransactionModel;

