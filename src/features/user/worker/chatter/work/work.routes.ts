import ChatterUserServiceModel from "../../../../../lib/modules/db/models/service/chatter.model";
import ChatTaskModel from "../../../../../lib/modules/db/models/task/chat.model";
import ChatterTaskModel from "../../../../../lib/modules/db/models/task/chatter.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import UserChatterController from "./work.controller";
import ChatterWorkTaskService from "./work.service";
import ChatterersTaskChatterValidator from "./work.validator";

const useChatterWorkForUserRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new ChatterersTaskChatterValidator();
    const chatModel = new ChatTaskModel();
    const chatterTaskModel = new ChatterTaskModel();
    const chatterServiceModel = new ChatterUserServiceModel();
    const userModel = new UserModel();

    const raiderTaskService = new ChatterWorkTaskService({ chatterTaskModel, chatModel, chatterServiceModel, userModel });

    const clientChatterController = new UserChatterController({ taskValidator, raiderTaskService });

    router.postWithBodyAndAuth('/start_raid', clientChatterController.startChatterTask );

    router.postWithBodyAndAuth('/complete_raid', clientChatterController.completeChatterTask );

    router.postWithBodyAndAuth('/cancel_raid', clientChatterController.cancelChatterTask );

    router.getWithAuth('/', clientChatterController.getAllUserChatter );

    router.getWithAuth('/status/task', clientChatterController.getUserStatusChatters );
    router.getWithAuth('/single/task', clientChatterController.getAllUserSingleChattersTask );
    router.getWithAuth('/status/total', clientChatterController.getUserTotalStatusTask );

    router.getWithAuth('/:raidId', clientChatterController.getUserSingleChatter );
}

export default useChatterWorkForUserRoutes;