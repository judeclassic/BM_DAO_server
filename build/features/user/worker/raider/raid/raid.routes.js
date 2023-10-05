"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raider_model_1 = __importDefault(require("../../../../../lib/modules/db/models/service/raider.model"));
const raid_model_1 = __importDefault(require("../../../../../lib/modules/db/models/task/raid.model"));
const raider_model_2 = __importDefault(require("../../../../../lib/modules/db/models/task/raider.model"));
const raid_controller_1 = __importDefault(require("./raid.controller"));
const raid_service_1 = __importDefault(require("./raid.service"));
const raid_validator_1 = __importDefault(require("./raid.validator"));
const useRaiderRaidForUserRoutes = ({ router }) => {
    const taskValidator = new raid_validator_1.default();
    const raidModel = new raid_model_1.default();
    const raiderTaskModel = new raider_model_2.default();
    const raiderServiceModel = new raider_model_1.default();
    const raiderTaskService = new raid_service_1.default({ raiderTaskModel, raidModel, raiderServiceModel });
    const clientRaidController = new raid_controller_1.default({ taskValidator, raiderTaskService });
    router.postWithBodyAndAuth('/start_raid', clientRaidController.startRaidTask);
    router.postWithBodyAndAuth('/complete_task', clientRaidController.completeRaidTask);
    router.getWithAuth('/', clientRaidController.getAllUserRaid);
    router.getWithAuth('/:raidId', clientRaidController.getUserSingleRaid);
};
exports.default = useRaiderRaidForUserRoutes;
