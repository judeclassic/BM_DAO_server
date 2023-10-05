"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raider_routes_1 = __importDefault(require("./raider.routes"));
const moderator_routes_1 = __importDefault(require("./moderator.routes"));
const useServiceRoutes = ({ router }) => {
    router.extend('/moderator', moderator_routes_1.default);
    router.extend('/raider', raider_routes_1.default);
};
exports.default = useServiceRoutes;
