import RequestHandler from "../../../../../lib/modules/server/router";
import useChattererTaskForModeratorRoutes from "./chat_engagers/moderator_chat.routes";
import useRaiderTaskForModeratorRoutes from "./raiders/moderator_raid.routes";


const useModeratorRaiderTaskRoutes = ({router}: {router: RequestHandler}) => {
    router.extend('/raider', useRaiderTaskForModeratorRoutes);
    router.extend('/chatter', useChattererTaskForModeratorRoutes);
}

export default useModeratorRaiderTaskRoutes;