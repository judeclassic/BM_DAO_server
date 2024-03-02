import AuthorizationRepo from "../../../lib/modules/auth";
import ModeratorUserServiceModel from "../../../lib/modules/db/models/service/moderator.model";
import RaiderUserServiceModel from "../../../lib/modules/db/models/service/raider.model";
import UserModel from "../../../lib/modules/db/models/user.model";
import MailerRepo from "../../../lib/modules/mailer";
import RequestHandler from "../../../lib/modules/server/router";
import UserAuthController from "./auth.controller";
import UserAuthService from "./auth.service";
import UserAuthValidator from "./auth.validator";
import CryptoRepository from "../../../lib/modules/crypto/crypto";

const useUserAuthRoutes = ({router}: {router: RequestHandler}) => {
    const authValidator = new UserAuthValidator();
    
    const authRepo = new AuthorizationRepo();
    const mailRepo = new MailerRepo();
    const userModel = new UserModel();
    const moderatorUserServiceModel = new ModeratorUserServiceModel();
    const raiderUserServiceModel = new RaiderUserServiceModel();
    const cryptoRepository = new CryptoRepository()
    
    const userAuthService = new UserAuthService({ mailRepo, authRepo, userModel, raiderUserServiceModel, moderatorUserServiceModel, cryptoRepository });

    // AUTH ROUTES HANDLER
    const userAuthController = new UserAuthController({ authValidator, userAuthService });

    router.postWithBody('/register', userAuthController.registerUser);

    router.postWithBody('/login', userAuthController.loginUser);

    router.postWithBody('/password/reset', userAuthController.resetPassword);

    router.postWithBody('/password/confirmreset', userAuthController.confirmResetPassword);

    router.postWithBodyAndAuth('/logout', userAuthController.logout);
}

export default useUserAuthRoutes;