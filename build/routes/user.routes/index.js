"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_routes_1 = __importDefault(require("./password.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const service_routes_1 = __importDefault(require("./service.routes"));
const useUserRoutes = ({ router }) => {
    // ONBORDING USER ROUTES HANDLER
    router.extend('/auth', auth_routes_1.default);
    router.extend('/password', password_routes_1.default);
    router.extend('/profile', profile_routes_1.default);
    router.extend('/service', service_routes_1.default);
};
exports.default = useUserRoutes;
