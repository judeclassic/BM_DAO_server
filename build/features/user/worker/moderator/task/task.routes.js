"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moderator_raid_routes_1 = __importDefault(require("./raiders/moderator_raid.routes"));
const useModeratorRaiderTaskRoutes = ({ router }) => {
    router.extend('/raider', moderator_raid_routes_1.default);
};
exports.default = useModeratorRaiderTaskRoutes;
