import ChatTaskModel from "../../../../../lib/modules/db/models/task/chat.model";
import ChatterTaskModel from "../../../../../lib/modules/db/models/task/chatter.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import ChatterUserController from "./task.controller";
import ChatterUserTaskService from "./task.service";
import ChattersTaskValidator from "./task.validator";


const useChatterTaskForUserRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new ChattersTaskValidator();

    const chatTaskModel = new ChatTaskModel();
    const chatterTaskModel = new ChatterTaskModel();

    const chatterTaskService = new ChatterUserTaskService({ chatTaskModel, chatterTaskModel });

    const chatterTaskController = new ChatterUserController({ taskValidator, chatterTaskService });

    router.getWithAuth('/active', chatterTaskController.getAllActiveTask );

    router.getWithAuth('/other', chatterTaskController.getAllOtherTask );

    router.getWithAuth('/other/time', chatterTaskController.getAllOtherCliamableTask );

    router.getWithAuth('/single_task/:taskId', chatterTaskController.getSingleTask );
}

export default useChatterTaskForUserRoutes;