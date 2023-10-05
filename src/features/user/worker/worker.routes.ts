import RequestHandler from "../../../lib/modules/server/router";
import useUserWorkerModeratorRoutes from "./moderator/worker.routes";
import useUserRaiderRoutes from "./raider/raider.routes";


const useUserWorkerRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/raider', useUserRaiderRoutes);
    router.extend('/moderator', useUserWorkerModeratorRoutes);
}

export default useUserWorkerRoutes;