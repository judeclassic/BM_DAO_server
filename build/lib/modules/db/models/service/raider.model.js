"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserService = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const raiders_dto_1 = __importStar(require("../../../../../types/dtos/service/raiders.dto"));
const enums_1 = require("../../../../../types/interfaces/response/services/enums");
const logger_1 = require("../../../logger");
const AnalyticSchema = new mongoose_1.Schema({
    availableTask: {
        type: Number,
        default: 0,
    },
    pendingTask: {
        type: Number,
        default: 0,
    },
    completedTask: {
        type: Number,
        default: 0,
    },
});
const RaiderUserServiceSchema = new mongoose_1.Schema({
    accountType: {
        type: String,
        enum: Object.values(enums_1.ServiceAccountTypeEnum),
        required: [true, 'accountType is required'],
    },
    userId: {
        type: String,
    },
    updatedAt: {
        type: Date
    },
    createdAt: {
        type: Date
    },
    isVerified: {
        type: Boolean
    },
    subscriptionDate: {
        type: Number,
    },
    work_timeout: {
        type: Number,
    },
    analytics: {
        type: AnalyticSchema,
        default: {
            availableTask: 0,
            pendingTask: 0,
            completedTask: 0
        }
    }
});
RaiderUserServiceSchema.plugin(mongoose_paginate_v2_1.default);
exports.UserService = (0, mongoose_1.model)("RaiderService", RaiderUserServiceSchema);
class RaiderUserServiceModel {
    constructor() {
        this.createUserService = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.create(details);
                if (data) {
                    return { status: true, data: new raiders_dto_1.default(data) };
                }
                else {
                    return { status: false, error: "Couldn't update userservice" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateUserService = (id, details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.findByIdAndUpdate(id, details, { new: true });
                if (data) {
                    return { status: true, data: new raiders_dto_1.default(data) };
                }
                else {
                    return { status: false, error: "Couldn't update userservice" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateCreatedAnalytics = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.findOne({ userId });
                if (data) {
                    data.analytics.availableTask++;
                    data.analytics.pendingTask++;
                    const updatedUser = yield data.save();
                    return { status: true, data: new raiders_dto_1.default(updatedUser !== null && updatedUser !== void 0 ? updatedUser : data) };
                }
                else {
                    return { status: false, error: "Couldn't updated user" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateCompletedAnalytics = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.findOne({ userId });
                if (data) {
                    data.analytics.pendingTask--;
                    data.analytics.completedTask++;
                    const updatedUser = yield data.save();
                    return { status: true, data: new raiders_dto_1.default(updatedUser !== null && updatedUser !== void 0 ? updatedUser : data) };
                }
                else {
                    return { status: false, error: "Couldn't update userservice" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.updateCancelAnalytics = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.findOne({ userId });
                if (data) {
                    data.analytics.availableTask--;
                    data.analytics.pendingTask--;
                    const updatedUser = yield data.save();
                    return { status: true, data: new raiders_dto_1.default(updatedUser !== null && updatedUser !== void 0 ? updatedUser : data) };
                }
                else {
                    return { status: false, error: "Couldn't update userservice" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.checkIfExist = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.findOne(details);
                if (data) {
                    return { status: true, data: new raiders_dto_1.default(data) };
                }
                else {
                    return { status: false, error: "Couldn't update userservice" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.getAllUserService = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.paginate(details, option);
                if (data) {
                    return { status: true,
                        data: new raiders_dto_1.MultipleUserServiceDto({
                            userServices: data.docs,
                            totalUserServices: data.totalDocs,
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
        this.getAllUserServices = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.find(details);
                if (data) {
                    return { status: true, data: data.map((service) => new raiders_dto_1.default(service)) };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.getAllUserServicesInPages = (details, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.paginate(details, option);
                if (data) {
                    return { status: true,
                        data: new raiders_dto_1.MultipleUserServiceDto({
                            userServices: data.docs,
                            totalUserServices: data.totalDocs,
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
        this.getAllUserServiceByWorkStatus = (status, option) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = Date.parse((new Date()).toISOString());
                const data = status === 'free' ?
                    yield this.UserService.paginate({ work_timeout: { $lt: currentTime }, subscriptionDate: { $lt: currentTime } }, option)
                    :
                        yield this.UserService.paginate({ work_timeout: { $gt: currentTime }, subscriptionDate: { $lt: currentTime } }, option);
                if (data) {
                    return { status: true,
                        data: new raiders_dto_1.MultipleUserServiceDto({
                            userServices: data.docs,
                            totalUserServices: data.totalDocs,
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
        this.countUsersInPlatform = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.count(details);
                if (data) {
                    return { status: true, data };
                }
                else {
                    return { status: false, error: "Couldn't get store details" };
                }
            }
            catch (error) {
                return { status: false, error };
            }
        });
        this.deleteUserService = (requestId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.findByIdAndRemove(requestId);
                if (data) {
                    return { status: true, data: new raiders_dto_1.default(data) };
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
        this.UserService = exports.UserService;
    }
}
exports.default = RaiderUserServiceModel;
