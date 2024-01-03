import RequestHandler from "../../lib/modules/server/router";
import useUserAuthRoutes from "./auth/auth.routes";
import useClientsRoutes from "./client/client.routes";
import useUserPersonalRoutes from "./personal/personal.routes";
import useUserWorkerRoutes from "./worker/worker.routes";

const useUserRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/auth', useUserAuthRoutes);
    router.extend('/client', useClientsRoutes);
    router.extend('/personal', useUserPersonalRoutes);
    router.extend('/worker', useUserWorkerRoutes);
}

export default useUserRoutes;