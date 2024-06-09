import RaiderUserServiceModel from "../../../../../lib/modules/db/models/service/raider.model";
import RaidModel from "../../../../../lib/modules/db/models/task/raid.model";
import RaiderTaskModel from "../../../../../lib/modules/db/models/task/raider.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import UserRaidController from "./raid.controller";
import RaiderUserTaskRaidService from "./raid.service";
import RaidersTaskRaidValidator from "./raid.validator";

const useRaiderRaidForUserRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new RaidersTaskRaidValidator();
    const raidModel = new RaidModel();
    const raiderTaskModel = new RaiderTaskModel();
    const raiderServiceModel = new RaiderUserServiceModel();
    const userModel = new UserModel();

    const raiderTaskService = new RaiderUserTaskRaidService({ raiderTaskModel, raidModel, raiderServiceModel, userModel });

    const clientRaidController = new UserRaidController({ taskValidator, raiderTaskService });

    router.postWithBodyAndAuth('/start_raid', clientRaidController.startRaidTask );

    router.postWithBodyAndAuth('/complete_raid', clientRaidController.completeRaidTask );

    router.postWithBodyAndAuth('/cancel_raid', clientRaidController.cancelRaidTask );

    router.getWithAuth('/', clientRaidController.getAllUserRaid );

    router.getWithAuth('/by/status', clientRaidController.getAllRaidByStatus );

    router.getWithAuth('/:raidId', clientRaidController.getUserSingleRaid );
}

export default useRaiderRaidForUserRoutes;