import RequestHandler from "../../../lib/modules/server/router";
import useClientChattersTaskRoutes from "./task/chatter/chatter.routes";
import useClientRaidersTaskRoutes from "./task/raider/raider.routes";

const useClientsRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/raider', useClientRaidersTaskRoutes)
    router.extend('/chatter', useClientChattersTaskRoutes)
}

export default useClientsRoutes;