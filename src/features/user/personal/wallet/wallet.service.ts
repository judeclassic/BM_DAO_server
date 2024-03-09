import TransactionModel from "../../../../lib/modules/db/models/transaction.model";
import { MultipleTransactionDto, TransactionDto } from "../../../../types/dtos/transaction.dto";
import ErrorInterface from "../../../../types/interfaces/error";
import UserModelInterface from "../../../../types/interfaces/modules/db/models/Iuser.model";
import { TransactionStatusEnum, TransactionTypeEnum } from "../../../../types/interfaces/response/transaction.response";
import CryptoRepository from "../../../../lib/modules/crypto/crypto";

const ERROR_USER_NOT_FOUND: ErrorInterface = {
  field: 'password',
  message: 'User with this email/password combination does not exist.',
};

const ERROR_CRYPTO_FOUND: ErrorInterface = {
  field: 'account',
  message: 'unable to fund wallet, check your crypto wallet balance',
};

const ERROR_CRYPTO_WITHDRAW: ErrorInterface = {
  field: 'account',
  message: 'unable withdraw fund, please try again',
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

  public fundUserWallet = async (userId: string, amount: number): Promise<{
    errors?: ErrorInterface[];
    data?: TransactionDto;
  }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });
    if ( !user.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    if (!user.data.wallet.wallet) return { errors: [ERROR_USER_NOT_FOUND] };

    const cryptoDeposit = await this._cryptoRepository.deposit({address: user.data.wallet.wallet?.address, private_key: user.data.wallet.wallet?.privateKey, amount: amount})

    if (cryptoDeposit.error) return { errors: [ERROR_CRYPTO_FOUND] };

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

  public withdrawUserWallet =async (userId: string, amount: number, wallet: string): Promise<{
    errors?: ErrorInterface[];
    data?: TransactionDto;
  }> => {
    const user = await this._userModel.checkIfExist({ _id: userId });
    if ( !user.data ) return { errors: [ERROR_USER_NOT_FOUND] };

    if (!user.data.wallet.wallet) return { errors: [ERROR_USER_NOT_FOUND] };

    const cryptoDeposit = await this._cryptoRepository.withdrawal({address: wallet, amount: amount})

    if (cryptoDeposit.error) return { errors: [ERROR_CRYPTO_WITHDRAW] };

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
