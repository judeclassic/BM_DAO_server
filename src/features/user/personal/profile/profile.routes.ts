import AuthorizationRepo from "../../../../lib/modules/auth";
import ModeratorUserServiceModel from "../../../../lib/modules/db/models/service/moderator.model";
import RaiderUserServiceModel from "../../../../lib/modules/db/models/service/raider.model";
import UserModel from "../../../../lib/modules/db/models/user.model";
import MailerRepo from "../../../../lib/modules/mailer";
import RequestHandler from "../../../../lib/modules/server/router";
import UserProfileController from "./profile.controller";
import UserProfileService from "./profile.service";
import UserProfileValidator from "./profile.validator";

const useUserProfileRoutes = ({router}: {router: RequestHandler}) => {
    const userValidator = new UserProfileValidator();
    
    const userModel = new UserModel();
    const raiderUserServiceModel = new RaiderUserServiceModel();
    const moderatorUserServiceModel = new ModeratorUserServiceModel();
    
    const userService = new UserProfileService({ userModel, raiderUserServiceModel, moderatorUserServiceModel });

    const userController = new UserProfileController({ userValidator, userService });

    router.getWithAuth('/', userController.viewProfile);
    router.postWithBodyAndAuth('/update', userController.updateProfile);
    router.getWithAuth('/referal/:level', userController.getUserReferals);
}

export default useUserProfileRoutes;