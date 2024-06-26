import AuthorizationRepo from "../../../../../lib/modules/auth";
import ModeratorUserServiceModel from "../../../../../lib/modules/db/models/service/moderator.model";
import RaiderUserServiceModel from "../../../../../lib/modules/db/models/service/raider.model";
import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import RaiderUserServiceController from "./raider_service.controller";
import RaiderUserServiceService from "./raider_service.service";
import UserRaiderServiceValidator from "./raider_service.validator";

const useRaiderUserServicesRoutes = ({router}: {router: RequestHandler}) => {
    const raiderServiceValidator = new UserRaiderServiceValidator();
    
    const authRepo = new AuthorizationRepo();
    const userModel = new UserModel();
    const userServiceModel = new RaiderUserServiceModel()
    const transactionModel = new TransactionModel()
    const moderatorServiceModel = new ModeratorUserServiceModel()
    
    const raiderServiceService = new RaiderUserServiceService({ authRepo, userModel, userServiceModel, transactionModel, moderatorServiceModel});

    const userServiceController = new RaiderUserServiceController({ raiderServiceValidator, raiderServiceService });

    router.postWithBodyAndAuth('/subscribe', userServiceController.subscribeUserService );

    router.postWithBodyAndAuth('/resubscribe', userServiceController.reSubscribeUserService );

    router.getWithAuth('/all', userServiceController.listAllUserServices );

    router.getWithAuth('/', userServiceController.getUserService );

    router.postWithBodyAndAuth('/unsubscibe', userServiceController.unSubscribeFromUserService );

    router.postWithBodyAndAuth('/updatehandle', userServiceController.updateSocialHandle );
}

export default useRaiderUserServicesRoutes;