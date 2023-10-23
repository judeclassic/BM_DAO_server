import RaiderUserServiceModel from "../../../../../lib/modules/db/models/service/raider.model";
import RaiderTaskModel from "../../../../../lib/modules/db/models/task/raider.model";
import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import RaiderClientTaskService from "./raider.client.service";
import ClientRaidController from "./raider.controller";
import RaiderClientTaskValidator from "./raider.validator";

const useClientRaidersTaskRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new RaiderClientTaskValidator();

    const userModel = new UserModel();
    const raiderTaskModel = new RaiderTaskModel();
    const raiderServiceModel = new RaiderUserServiceModel();
    const transactionModel = new TransactionModel()

    const raiderTaskService = new RaiderClientTaskService({ raiderTaskModel, userModel, raiderServiceModel, transactionModel });

    const clientRaidController = new ClientRaidController({ taskValidator, raiderTaskService });

    router.postWithBodyAndAuth('/create_raid', clientRaidController.createRaidTask );

    router.postWithBodyAndAuth('/create_task', clientRaidController.createTask );

    router.getWithAuth('/getactiveusertasks', clientRaidController.getActiveTasks );

    router.getWithAuth('/getusertasks', clientRaidController.getAllUserTask );

    router.getWithAuth('/getsingleTask', clientRaidController.getUserSingleTask );
}

export default useClientRaidersTaskRoutes;