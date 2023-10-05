"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raiders_routes_1 = __importDefault(require("./raiders.routes"));
const useModeratorTaskRoutes = ({ router }) => {
    router.extend('/raider', raiders_routes_1.default);
};
exports.default = useModeratorTaskRoutes;
