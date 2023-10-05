import AuthorizationRepo from "../../../../lib/modules/auth";
import RaiderUserServiceModel from "../../../../lib/modules/db/models/service/raider.model";
import TransactionModel from "../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../lib/modules/db/models/user.model";
import MailerRepo from "../../../../lib/modules/mailer";
import RequestHandler from "../../../../lib/modules/server/router";
import UserProfileController from "./wallet.controller";
import UserProfileService from "./wallet.service";
import UserProfileValidator from "./wallet.validator";

const useUserWalletRoutes = ({router}: {router: RequestHandler}) => {
    const userValidator = new UserProfileValidator();
    
    const userModel = new UserModel();
    const transactionModel = new TransactionModel();
    
    const userService = new UserProfileService({ userModel, transactionModel });
    const userController = new UserProfileController({ userValidator, userService });

    router.postWithBodyAndAuth('/fund', userController.fundUserWallet);
    router.postWithBodyAndAuth('/withdraw', userController.withdrawUserWallet);
    router.getWithAuth('/all', userController.getAllUserTransaction);
}

export default useUserWalletRoutes;