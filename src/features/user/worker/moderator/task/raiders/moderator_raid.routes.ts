import ModeratorUserServiceModel from "../../../../../../lib/modules/db/models/service/moderator.model";
import RaiderUserServiceModel from "../../../../../../lib/modules/db/models/service/raider.model";
import RaidModel from "../../../../../../lib/modules/db/models/task/raid.model";
import RaiderTaskModel from "../../../../../../lib/modules/db/models/task/raider.model";
import TransactionModel from "../../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../../lib/modules/server/router";
import ModeratorUserRaidController from "./moderator.controller";
import ModeratorUserTaskService from "./moderator.service";
import ModeratorTaskValidator from "./moderator.validator";

const useRaiderTaskForModeratorRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new ModeratorTaskValidator();

    const userModel = new UserModel();
    const raidModel = new RaidModel();
    const raiderTaskModel = new RaiderTaskModel();
    const raiderServiceModel = new RaiderUserServiceModel();
    const moderatorServiceModel = new ModeratorUserServiceModel();
    const transactionModel = new TransactionModel()

    const moderatorUserTaskService = new ModeratorUserTaskService({ raiderTaskModel, raidModel, raiderServiceModel, moderatorServiceModel, userModel, transactionModel });

    const clientRaidController = new ModeratorUserRaidController({ taskValidator, moderatorUserTaskService });

    router.getWithAuth('/active', clientRaidController.getAllActiveTask );

    router.getWithAuth('/other', clientRaidController.getAllOtherTask );

    router.postWithBodyAndAuth('/moderate_task', clientRaidController.moderateTask );

    router.getWithAuth('/me/active', clientRaidController.getAllModeratorsActiveTasks );

    router.getWithAuth('/me/other', clientRaidController.getAllModeratorsTasks );

    router.getWithAuth('/me', clientRaidController.getModeratorTask );

    router.postWithBodyAndAuth('/me/approve', clientRaidController.approveTaskAsComplete );

    router.getWithAuth('/raids/:taskId', clientRaidController.getModeratedRaids );

    router.getWithAuth('/raid/:raidId', clientRaidController.getUserSingleRaid );

    router.postWithBodyAndAuth('/raid/reject', clientRaidController.rejectRaid );
}

export default useRaiderTaskForModeratorRoutes;