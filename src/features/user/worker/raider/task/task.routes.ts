import RaiderUserServiceModel from "../../../../../lib/modules/db/models/service/raider.model";
import RaidModel from "../../../../../lib/modules/db/models/task/raid.model";
import RaiderTaskModel from "../../../../../lib/modules/db/models/task/raider.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import UserRaidController from "./task.controller";
import RaiderUserTaskService from "./task.service";
import RaidersTaskValidator from "./task.validator";

const useRaiderTaskForUserRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new RaidersTaskValidator();

    const raiderTaskModel = new RaiderTaskModel();

    const raiderTaskService = new RaiderUserTaskService({ raiderTaskModel });

    const clientRaidController = new UserRaidController({ taskValidator, raiderTaskService });

    router.getWithAuth('/active', clientRaidController.getAllActiveTask );

    router.getWithAuth('/other', clientRaidController.getAllOtherTask );

    router.getWithAuth('/single_task/:taskId', clientRaidController.getSingleTask );
}

export default useRaiderTaskForUserRoutes;