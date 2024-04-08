import ModeratorUserServiceModel from "../../../../../../lib/modules/db/models/service/moderator.model";
import TransactionModel from "../../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../../lib/modules/server/router";
import ModeratorUserRaidController from "./moderator_chat.controller";
import ModeratorUserTaskService from "./moderator_chat.service";
import ModeratorTaskValidator from "./moderator.validator";
import ChatterTaskModel from "../../../../../../lib/modules/db/models/task/chatter.model";
import ChatTaskModel from "../../../../../../lib/modules/db/models/task/chat.model";
import ChatterUserServiceModel from "../../../../../../lib/modules/db/models/service/chatter.model";

const useRaiderTaskForModeratorRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new ModeratorTaskValidator();
    const userModel = new UserModel();
    const chatModel = new ChatTaskModel();
    const chatterTaskModel = new ChatterTaskModel()
    const chatterServiceModel = new ChatterUserServiceModel()
    const moderatorServiceModel = new ModeratorUserServiceModel();
    const transactionModel = new TransactionModel()

    const moderatorUserTaskService = new ModeratorUserTaskService({ chatterTaskModel, chatModel, chatterServiceModel, moderatorServiceModel, userModel, transactionModel });

    const clientRaidController = new ModeratorUserRaidController({ taskValidator, moderatorUserTaskService });

    // router.getWithAuth('/active', clientRaidController.getAllActiveTask );

    router.getWithAuth('/other', clientRaidController.getAllOtherTask );

    router.getWithAuth('/task/:taskId', clientRaidController.getSingleTask );

    // router.postWithBodyAndAuth('/moderate_task', clientRaidController.moderateTask );

    router.getWithAuth('/me/active', clientRaidController.getAllModeratorsActiveTasks );

    router.getWithAuth('/me/other', clientRaidController.getAllModeratorsTasks );

    // router.getWithAuth('/me', clientRaidController.getModeratorTask );

    router.postWithBodyAndAuth('/me/approve', clientRaidController.approveTaskAsComplete );

    router.getWithAuth('/chats/:taskId', clientRaidController.getModeratedChats );
    
    router.getWithAuth('/chat/:chatId', clientRaidController.getUserSingleChat );

    router.postWithBodyAndAuth('/chat/approve', clientRaidController.approveChat );

    router.postWithBodyAndAuth('/chat/reject', clientRaidController.rejectChat );
}

export default useRaiderTaskForModeratorRoutes;