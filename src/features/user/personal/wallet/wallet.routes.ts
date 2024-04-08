import TransactionModel from "../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../lib/modules/server/router";
import UserProfileController from "./wallet.controller";
import UserProfileService from "./wallet.service";
import UserProfileValidator from "./wallet.validator";
import CryptoRepository from "./../../../../lib/modules/crypto/crypto";

const useUserWalletRoutes = ({router}: {router: RequestHandler}) => {
    const userValidator = new UserProfileValidator();
    
    const userModel = new UserModel();
    const transactionModel = new TransactionModel();
    const cryptoRepository = new CryptoRepository()
    
    const userService = new UserProfileService({ userModel, transactionModel, cryptoRepository });
    const userController = new UserProfileController({ userValidator, userService });

    router.postWithBodyAndAuth('/fund', userController.fundUserWallet);
    router.postWithBodyAndAuth('/withdraw', userController.withdrawUserWallet);
    router.getWithAuth('/', userController.getWalletInformation);
    router.getWithAuth('/all', userController.getAllUserTransaction);
}

export default useUserWalletRoutes;