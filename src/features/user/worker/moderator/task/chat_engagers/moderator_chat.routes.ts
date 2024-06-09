import ModeratorUserServiceModel from "../../../../../../lib/modules/db/models/service/moderator.model";
import TransactionModel from "../../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../../lib/modules/server/router";
import ModeratorUserChatterController from "./moderator_chat.controller";
import ModeratorUserTaskService from "./moderator_chat.service";
import ModeratorTaskValidator from "./moderator.validator";
import ChatterTaskModel from "../../../../../../lib/modules/db/models/task/chatter.model";
import ChatTaskModel from "../../../../../../lib/modules/db/models/task/chat.model";
import ChatterUserServiceModel from "../../../../../../lib/modules/db/models/service/chatter.model";

const useChattererTaskForModeratorRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new ModeratorTaskValidator();
    const userModel = new UserModel();
    const chatModel = new ChatTaskModel();
    const chatterTaskModel = new ChatterTaskModel()
    const chatterServiceModel = new ChatterUserServiceModel()
    const moderatorServiceModel = new ModeratorUserServiceModel();
    const transactionModel = new TransactionModel()

    const moderatorUserTaskService = new ModeratorUserTaskService({ chatterTaskModel, chatModel, chatterServiceModel, moderatorServiceModel, userModel, transactionModel });

    const clientChatterController = new ModeratorUserChatterController({ taskValidator, moderatorUserTaskService });

    // router.getWithAuth('/active', clientChatterController.getAllActiveTask );

    router.getWithAuth('/other', clientChatterController.getAllOtherTask );

    router.getWithAuth('/task/by/status', clientChatterController.getAllTaskByStatus );// by Akin
    router.getWithAuth('/chat/task', clientChatterController.getModeratorChatTask );// by Akin

    router.getWithAuth('/task/:taskId', clientChatterController.getSingleTask );

    // router.postWithBodyAndAuth('/moderate_task', clientChatterController.moderateTask );

    router.getWithAuth('/me/active', clientChatterController.getAllModeratorsActiveTasks );

    router.getWithAuth('/me/other', clientChatterController.getAllModeratorsTasks );

    // router.getWithAuth('/me', clientChatterController.getModeratorTask );

    router.postWithBodyAndAuth('/me/approve', clientChatterController.approveTaskAsComplete );

    router.getWithAuth('/chats/:taskId', clientChatterController.getModeratedChats );
    
    router.getWithAuth('/chat/:chatId', clientChatterController.getUserSingleChat );

    router.postWithBodyAndAuth('/chat/approve', clientChatterController.approveChat );

    router.postWithBodyAndAuth('/chat/reject', clientChatterController.rejectChat );
}

export default useChattererTaskForModeratorRoutes;