import TransactionModel from "../../../../lib/modules/db/models/transaction.model";
import { MultipleTransactionDto, TransactionDto } from "../../../../types/dtos/transaction.dto";
import ErrorInterface from "../../../../types/interfaces/error";
import UserModelInterface from "../../../../types/interfaces/modules/db/models/Iuser.model";
import { TransactionStatusEnum, TransactionTypeEnum } from "../../../../types/interfaces/response/transaction.response";
import CryptoRepository from "../../../../lib/modules/crypto/crypto";
import UserDto from "../../../../types/dtos/user.dto";

const ERROR_USER_NOT_FOUND: ErrorInterface = {
  field: 'password',
  message: 'User with this email/password combination does not exist.',
};

class UserWalletService {
  private _userModel: UserModelInterface;
  private _transactionModel: TransactionModel;
  private _cryptoRepository: CryptoRepository

  constructor ({ userModel, transactionModel, cryptoRepository } : {
    userModel: UserModelInterface;
    transactionModel: TransactionModel;
    cryptoRepository: CryptoRepository
  }){
    this._userModel = userModel;
    this._transactionModel = transactionModel;
    this._cryptoRepository = cryptoRepository
  }

  public getWalletInformation = async (userId: string): Promise<{
    errors?: ErrorInterface[];
    user?: UserDto;
  }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });
    if ( !user.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    if (!user.data.wallet.wallet) {
      const wallet = this._cryptoRepository.createWallet();
      if (!wallet?.address) {
        return { errors: [ERROR_USER_NOT_FOUND] };
      }
      user.data.wallet.wallet = {
        address: wallet.address,
        privateKey:  wallet.private_key
      }
    }

    
    const finalUser = await this._userModel.updateUserDetailToDB(user.data.id!, {
      wallet: user.data.wallet
    });
    if ( !finalUser.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    const walletBalance = this._cryptoRepository.getTokenPrice(user.data.wallet.wallet?.address)
    if (!walletBalance) {
      user.data.wallet.wallet.balance = walletBalance;
    }

    return { user: finalUser.data }
  }

  public fundUserWallet = async (userId: string, amount: number): Promise<{
    errors?: ErrorInterface[];
    data?: TransactionDto;
  }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });
    if ( !user.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    if (!user.data.wallet.wallet) return { errors: [ERROR_USER_NOT_FOUND] };

    const cryptoDeposit = await this._cryptoRepository.deposit({address: user.data.wallet.wallet?.address, private_key: user.data.wallet.wallet?.privateKey, amount: amount});
    if (cryptoDeposit.error) {
      return { errors: [{ message: cryptoDeposit.error }] };
    }

    user.data.updateUserWithdrawableBalance({ amount, type: 'paid'});

    const updatedUser = await this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
    if ( !updatedUser.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    const transaction = await this._transactionModel.saveTransaction({
      name: updatedUser.data.name,
      userId: user.data.id,
      updatedAt: new Date(),
      createdAt: new Date(),
      transactionType: TransactionTypeEnum.FUNDING,
      transactionStatus: TransactionStatusEnum.PENDING,
      amount: amount,
      isVerified: true,
    });

    if ( !transaction.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    return { data: transaction.data };
  };

  public withdrawUserWallet =async (userId: string, amount: number): Promise<{
    errors?: ErrorInterface[];
    data?: TransactionDto;
  }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });
    if ( !user.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    if (!user.data.wallet.wallet) return { errors: [ERROR_USER_NOT_FOUND] };

    const cryptoWithdrawal = await this._cryptoRepository.withdrawal({address: user.data.wallet.wallet?.address, amount: amount});
    if (cryptoWithdrawal.error) {
      return { errors: [{ message: cryptoWithdrawal.error }] };
    }

    user.data.updateUserWithdrawableBalance({ amount, type: 'charged'});

    const updatedUser = await this._userModel.updateUserDetailToDB(userId, user.data.getDBModel);
    if ( !updatedUser.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    const transaction = await this._transactionModel.saveTransaction({
      name: updatedUser.data.name,
      userId: user.data.id,
      updatedAt: new Date(),
      createdAt: new Date(),
      transactionType: TransactionTypeEnum.WITHDRAWAL,
      transactionStatus: TransactionStatusEnum.PENDING,
      amount: amount,
      isVerified: true,
    });

    if ( !transaction.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    return { data: transaction.data };
  };

  public getAllUserTransaction = async (userId: string, option: { limit: number, page: number }): Promise<{
    errors?: ErrorInterface[];
    data?: MultipleTransactionDto;
  }> => {
    const transactions = await this._transactionModel.getTransactions({ userId }, option);
    if (!transactions.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    return { data: transactions.data }
  };
}
export default UserWalletService;
