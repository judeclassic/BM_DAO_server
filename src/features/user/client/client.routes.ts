import RequestHandler from "../../../lib/modules/server/router";
import useClientRaidersTaskRoutes from "./task/raider/raider.routes";

const useClientsRoutes = ({ router }: {router: RequestHandler}) => {
    router.extend('/raider', useClientRaidersTaskRoutes)
}

export default useClientsRoutes;