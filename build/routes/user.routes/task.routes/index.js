"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moderators_1 = __importDefault(require("./moderators"));
const raiders_1 = __importDefault(require("./raiders"));
const useTaskRoutes = ({ router }) => {
    router.extend('/raid', raiders_1.default);
    router.extend('/moderator', moderators_1.default);
};
exports.default = useTaskRoutes;
