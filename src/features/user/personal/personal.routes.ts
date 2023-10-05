import RequestHandler from "../../../lib/modules/server/router";
import useUserProfileRoutes from "./profile/profile.routes";
import useUserWalletRoutes from "./wallet/wallet.routes";

const useUserPersonalRoutes = ({router}: {router: RequestHandler}) => {
    router.extend('/profile', useUserProfileRoutes);
    router.extend('/wallet', useUserWalletRoutes);
}

export default useUserPersonalRoutes;