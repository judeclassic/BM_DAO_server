import RequestHandler from "../../../../lib/modules/server/router";
import useRaiderRaidForUserRoutes from "./raid/raid.routes";
import useRaiderUserServicesRoutes from "./service/raider_service.routes";
import useRaiderTaskForUserRoutes from "./task/task.routes";


const useUserRaiderRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/task', useRaiderTaskForUserRoutes);
    router.extend('/service', useRaiderUserServicesRoutes);
    router.extend('/raid', useRaiderRaidForUserRoutes);
}

export default useUserRaiderRoutes;