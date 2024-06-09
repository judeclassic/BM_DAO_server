import AuthorizationRepo from "../../../../../lib/modules/auth";
import ChatterUserServiceModel from "../../../../../lib/modules/db/models/service/chatter.model";
import ModeratorUserServiceModel from "../../../../../lib/modules/db/models/service/moderator.model";
import RaiderUserServiceModel from "../../../../../lib/modules/db/models/service/raider.model";
import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import ModeratorUserServiceController from "./moderator_service.controller";
import ModeratorUserServiceService from "./moderator_service.service";
import UserServiceValidator from "./moderator_service.validator";

const useModeratorUserServicesRoutes = ({router}: {router: RequestHandler}) => {
    const userServiceValidator = new UserServiceValidator();
    
    const authRepo = new AuthorizationRepo();
    const userModel = new UserModel();
    const userServiceModel = new ModeratorUserServiceModel()
    const transactionModel = new TransactionModel();
    const chatterServiceModel = new ChatterUserServiceModel()
    const raiderServiceModel = new RaiderUserServiceModel()
    
    const userServiceService = new ModeratorUserServiceService({ authRepo, userModel, userServiceModel, transactionModel, chatterServiceModel, raiderServiceModel});

    const userServiceController = new ModeratorUserServiceController({ userServiceValidator, userServiceService });

    router.postWithBodyAndAuth('/subscribe', userServiceController.subscribeUserService );

    router.postWithBodyAndAuth('/resubscribe', userServiceController.reSubscribeUserService );

    router.getWithAuth('/all', userServiceController.listAllUserServices );

    router.getWithAuth('/', userServiceController.getUserService );

    router.postWithBodyAndAuth('/unsubscibe', userServiceController.unSubscribeFromUserService );
}

export default useModeratorUserServicesRoutes;