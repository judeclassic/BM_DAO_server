import RequestHandler from "../../../../lib/modules/server/router";
import useModeratorUserServicesRoutes from "./service/moderator_service.routes";
import useModeratorRaiderTaskRoutes from "./task/task.routes";

const useUserWorkerModeratorRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/service', useModeratorUserServicesRoutes);
    router.extend('/task', useModeratorRaiderTaskRoutes);
}

export default useUserWorkerModeratorRoutes;