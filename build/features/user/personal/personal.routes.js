"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_routes_1 = __importDefault(require("./profile/profile.routes"));
const wallet_routes_1 = __importDefault(require("./wallet/wallet.routes"));
const useUserPersonalRoutes = ({ router }) => {
    router.extend('/profile', profile_routes_1.default);
    router.extend('/wallet', wallet_routes_1.default);
};
exports.default = useUserPersonalRoutes;
