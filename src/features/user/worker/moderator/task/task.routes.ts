import RequestHandler from "../../../../../lib/modules/server/router";
import useRaiderTaskForModeratorRoutes from "./raiders/moderator_raid.routes";


const useModeratorRaiderTaskRoutes = ({router}: {router: RequestHandler}) => {
    router.extend('/raider', useRaiderTaskForModeratorRoutes);
}

export default useModeratorRaiderTaskRoutes;