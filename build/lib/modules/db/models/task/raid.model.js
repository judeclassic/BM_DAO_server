"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raid = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const logger_1 = require("../../../logger");
const raids_dto_1 = require("../../../../../types/dtos/service/raids.dto");
const RaidSchema = new mongoose_1.Schema({
    assignerId: String,
    assigneeId: String,
    taskId: String,
    timeLine: Number,
    taskStatus: String,
    proofs: [String],
});
RaidSchema.plugin(mongoose_paginate_v2_1.default);
exports.Raid = (0, mongoose_1.model)("Raid", RaidSchema);
class RaidModel {
    constructor() {
        this.deleteAllRaids = ({ taskId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.deleteMany({ taskId });
                if (data) {
                    return { status: true };
                }
                else {
                    return { status: false, error: "Couldn't create Raid" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.createRaid = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.create(details);
                if (data) {
                    return { status: true, data: new raids_dto_1.RaidDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't create Raid" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateRaid = (id, details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.findByIdAndUpdate(id, details, { new: true });
                if (data) {
                    return { status: true, data: new raids_dto_1.RaidDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't update Raid" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.checkIfExist = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.findOne(details);
                if (data) {
                    return { status: true, data: new raids_dto_1.RaidDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't update Raid" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.getAllRaid = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.paginate(details, option);
                if (data) {
                    return { status: true,
                        data: new raids_dto_1.MultipleRaidDto({
                            raids: data.docs,
                            totalRaids: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        }) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getAllRaids = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.find(details);
                if (data) {
                    return { status: true, data: data.map((service) => new raids_dto_1.RaidDto(service)) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getAllRaidsInPages = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.paginate(details, option);
                if (data) {
                    return { status: true,
                        data: new raids_dto_1.MultipleRaidDto({
                            raids: data.docs,
                            totalRaids: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        }) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getAllRaidByWorkStatus = (status, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = Date.parse((new Date()).toISOString());
                const data = status === 'free' ?
                    yield this.Raid.paginate({ work_timeout: { $lt: currentTime }, subscriptionDate: { $lt: currentTime } }, option)
                    :
                        yield this.Raid.paginate({ work_timeout: { $gt: currentTime }, subscriptionDate: { $lt: currentTime } }, option);
                if (data) {
                    return { status: true,
                        data: new raids_dto_1.MultipleRaidDto({
                            raids: data.docs,
                            totalRaids: data.totalDocs,
                            hasNextPage: data.hasNextPage
                        }) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.deleteRaid = (requestId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Raid.findByIdAndRemove(requestId);
                if (data) {
                    return { status: true, data: new raids_dto_1.RaidDto(data) };
                }
                else {
                    return { status: false, error: "Couldn't create user" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.Raid = exports.Raid;
    }
}
exports.default = RaidModel;
