import ChatterUserServiceModel from "../../../../../lib/modules/db/models/service/chatter.model";
import ChatTaskModel from "../../../../../lib/modules/db/models/task/chat.model";
import ChatterTaskModel from "../../../../../lib/modules/db/models/task/chatter.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import UserRaidController from "./work.controller";
import ChatterWorkTaskService from "./work.service";
import RaidersTaskRaidValidator from "./work.validator";

const useChatterWorkForUserRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new RaidersTaskRaidValidator();
    const chatModel = new ChatTaskModel();
    const chatterTaskModel = new ChatterTaskModel();
    const chatterServiceModel = new ChatterUserServiceModel();
    const userModel = new UserModel();

    const raiderTaskService = new ChatterWorkTaskService({ chatterTaskModel, chatModel, chatterServiceModel, userModel });

    const clientRaidController = new UserRaidController({ taskValidator, raiderTaskService });

    router.postWithBodyAndAuth('/start_raid', clientRaidController.startRaidTask );

    router.postWithBodyAndAuth('/complete_raid', clientRaidController.completeRaidTask );

    router.postWithBodyAndAuth('/cancel_raid', clientRaidController.cancelRaidTask );

    router.getWithAuth('/', clientRaidController.getAllUserRaid );

    router.getWithAuth('/:raidId', clientRaidController.getUserSingleRaid );
}

export default useChatterWorkForUserRoutes;