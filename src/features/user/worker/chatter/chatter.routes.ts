import RequestHandler from "../../../../lib/modules/server/router";
import useChatterUserServicesRoutes from "./service/chatter_service.routes";
import useChatterTaskForUserRoutes from "./task/task.routes";
import useChatterWorkForUserRoutes from "./work/work.routes";


const useUserChatterRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/service', useChatterUserServicesRoutes);
    router.extend('/task', useChatterTaskForUserRoutes);
    router.extend('/work', useChatterWorkForUserRoutes);
}

export default useUserChatterRoutes;