import TransactionModel from "../../../../../lib/modules/db/models/transaction.model";
import UserModel from "../../../../../lib/modules/db/models/user.model";
import RequestHandler from "../../../../../lib/modules/server/router";
import ClientRaidController from "./chatter.controller";
import RaiderClientTaskValidator from "./chatter.validator";
import ChatTaskModel from "../../../../../lib/modules/db/models/task/chat.model";
import ChatterTaskModel from "../../../../../lib/modules/db/models/task/chatter.model";
import ChatterUserServiceModel from "../../../../../lib/modules/db/models/service/chatter.model";
import ChatterClientTaskService from "./chatter.service";

const useClientChattersTaskRoutes = ({router}: {router: RequestHandler}) => {
    const taskValidator = new RaiderClientTaskValidator();

    const userModel = new UserModel();

    const chatTaskModel = new ChatTaskModel();
    const chatterTaskModel = new ChatterTaskModel();

    const chatterServiceModel = new ChatterUserServiceModel();
    const transactionModel = new TransactionModel()

    const raiderTaskService = new ChatterClientTaskService({ chatterTaskModel, chatTaskModel, userModel, chatterServiceModel, transactionModel });

    const clientRaidController = new ClientRaidController({ taskValidator, raiderTaskService });

    router.postWithBodyAndAuth('/create_task', clientRaidController.createTask );

    router.getWithAuth('/getactiveusertasks', clientRaidController.getActiveTasks );

    router.getWithAuth('/getusertasks', clientRaidController.getAllUserTask );

    router.getWithAuth('/getsingleTask', clientRaidController.getUserSingleTask );
}

export default useClientChattersTaskRoutes;