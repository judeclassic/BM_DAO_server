import RequestHandler from "../../../lib/modules/server/router";
import useUserChatterRoutes from "./chatter/chatter.routes";
import useUserWorkerModeratorRoutes from "./moderator/worker.routes";
import useUserRaiderRoutes from "./raider/raider.routes";


const useUserWorkerRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/chatter', useUserChatterRoutes);
    router.extend('/raider', useUserRaiderRoutes);
    router.extend('/moderator', useUserWorkerModeratorRoutes);
}

export default useUserWorkerRoutes;