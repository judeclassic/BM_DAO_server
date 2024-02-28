import AuthorizationRepo from "../../../../../lib/modules/auth";
import ChatterUserServiceModel from "../../../../../lib/modules/db/models/service/chatter.model";
import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import ChatterUserServiceController from "./chatter_service.controller";
import ChatterUserServiceService from "./chatter_service.service";
import UserRaiderServiceValidator from "./chatter_service.validator";

const useChatterUserServicesRoutes = ({router}: {router: RequestHandler}) => {
    const raiderServiceValidator = new UserRaiderServiceValidator();
    
    const authRepo = new AuthorizationRepo();
    const userModel = new UserModel();
    const userServiceModel = new ChatterUserServiceModel()
    const transactionModel = new TransactionModel()
    
    const raiderServiceService = new ChatterUserServiceService({ authRepo, userModel, userServiceModel, transactionModel });

    const userServiceController = new ChatterUserServiceController({ raiderServiceValidator, raiderServiceService });

    router.postWithBodyAndAuth('/subscribe', userServiceController.subscribeUserService );

    router.postWithBodyAndAuth('/resubscribe', userServiceController.reSubscribeUserService );

    router.getWithAuth('/all', userServiceController.listAllUserServices );

    router.getWithAuth('/', userServiceController.getUserService );

    router.postWithBodyAndAuth('/unsubscibe', userServiceController.unSubscribeFromUserService );

    router.postWithBodyAndAuth('/updatehandle', userServiceController.updateSocialHandle );
}

export default useChatterUserServicesRoutes;