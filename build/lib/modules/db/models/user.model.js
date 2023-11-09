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
exports.User = void 0;
//@ts-check
//User Schema
const mongoose_1 = require("mongoose");
const user_dto_1 = __importDefault(require("../../../../types/dtos/user.dto"));
const enums_1 = require("../../../../types/interfaces/response/services/enums");
const user_response_1 = require("../../../../types/interfaces/response/user.response");
const logger_1 = require("../../logger");
const WalletSchema = new mongoose_1.Schema({
    balance: {
        referalBonus: {
            type: Number,
        },
        taskBalance: {
            type: Number,
        },
        walletBalance: {
            type: Number
        },
        totalBalance: {
            type: Number
        }
    }
});
const AnalyticSchema = new mongoose_1.Schema({
    totalUploaded: Number,
    totalCompleted: Number,
    raiders: {
        totalUploaded: Number,
        totalCompleted: Number,
    },
    moderators: {
        totalUploaded: Number,
        totalCompleted: Number,
    },
    chatEngagers: {
        totalUploaded: Number,
        totalCompleted: Number,
    },
    collabManagers: {
        totalUploaded: Number,
        totalCompleted: Number,
    }
});
const UserSchema = new mongoose_1.Schema({
    accountType: {
        type: String,
        enum: Object.values(user_response_1.AccountTypeEnum),
        trim: true,
    },
    name: {
        type: String,
    },
    emailAddress: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
    },
    country: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    accessToken: {
        type: String
    },
    wallet: WalletSchema,
    referal: {
        myReferalCode: {
            type: String,
        },
        referalCode1: {
            type: String
        },
        referalCode2: {
            type: String
        },
        referalCode3: {
            type: String
        },
        analytics: {
            totalAmount: {
                type: Number,
                default: 0
            },
            totalEarned: {
                type: Number,
                default: 0
            },
            level1: {
                amount: {
                    type: Number,
                    default: 0
                },
                earned: {
                    type: Number,
                    default: 0
                },
            },
            level2: {
                amount: {
                    type: Number,
                    default: 0
                },
                earned: {
                    type: Number,
                    default: 0
                }
            },
            level3: {
                amount: {
                    type: Number,
                    default: 0
                },
                earned: {
                    type: Number,
                    default: 0
                }
            }
        }
    },
    authenticationCode: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    analytics: {
        type: AnalyticSchema,
    }
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
class UserModel {
    constructor() {
        this.deepSearchDetails = (name, data) => {
            const finalObject = {};
            Object.entries(data).forEach((data) => {
                finalObject[`personal_information.${data[0]}`] = data[1];
            });
            return finalObject;
        };
        this.updateBalance = (userId, amount) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.User.findByIdAndUpdate(userId, { $inc: {
                        'wallet.balance.walletBalance': amount,
                        'wallet.balance.totalBalance': amount,
                    } }, { new: true });
                if (data) {
                    return { status: true, data: new user_dto_1.default(data) };
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
        this.updateUpdatedAnalytics = (userId, type) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.User.findById(userId);
                if (data) {
                    if (!data.analytics)
                        data.analytics = this.createAnalytics;
                    data.analytics.totalUploaded++;
                    if (type === enums_1.ServiceAccountTypeEnum.chatter)
                        data.analytics.chatEngagers.totalUploaded++;
                    if (type === enums_1.ServiceAccountTypeEnum.collab_manager)
                        data.analytics.collabManagers.totalUploaded++;
                    if (type === enums_1.ServiceAccountTypeEnum.moderators)
                        data.analytics.moderators.totalUploaded++;
                    if (type === enums_1.ServiceAccountTypeEnum.raider)
                        data.analytics.raiders.totalUploaded++;
                    const updatedUser = yield data.save();
                    return { status: true, data: new user_dto_1.default(updatedUser !== null && updatedUser !== void 0 ? updatedUser : data) };
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
        this.updateCompletedAnalytics = (userId, type) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.User.findById(userId);
                if (data) {
                    if (!data.analytics)
                        data.analytics = this.createAnalytics;
                    data.analytics.totalCompleted++;
                    if (type === enums_1.ServiceAccountTypeEnum.chatter)
                        data.analytics.chatEngagers.totalCompleted++;
                    if (type === enums_1.ServiceAccountTypeEnum.collab_manager)
                        data.analytics.collabManagers.totalCompleted++;
                    if (type === enums_1.ServiceAccountTypeEnum.moderators)
                        data.analytics.moderators.totalCompleted++;
                    if (type === enums_1.ServiceAccountTypeEnum.raider)
                        data.analytics.raiders.totalCompleted++;
                    const updatedUser = yield data.save();
                    return { status: true, data: new user_dto_1.default(updatedUser !== null && updatedUser !== void 0 ? updatedUser : data) };
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
        this.saveUserToDB = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.User.create(details);
                if (data) {
                    return { status: true, data: new user_dto_1.default(data) };
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
        this.updateUserDetailToDB = (id, details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.User.findByIdAndUpdate(id, details, { new: true });
                if (data) {
                    return { status: true, data: new user_dto_1.default(data) };
                }
                else {
                    return { status: false, error: "Couldn't update user" };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.checkIfExist = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.User.findOne(details);
                if (data) {
                    return { status: true, data: new user_dto_1.default(data) };
                }
                else {
                    return { status: false, error: `Can't find Details` };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.checkIfReferalExist = (details) => __awaiter(this, void 0, void 0, function* () {
            const referalInformation = this.deepSearchDetails('referal', details);
            try {
                const data = yield this.User.findOne(referalInformation);
                if (data) {
                    return { status: true, data: new user_dto_1.default(data) };
                }
                else {
                    return { status: false, error: `Can't find Details` };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.getReferals = (details) => __awaiter(this, void 0, void 0, function* () {
            const referalInformation = this.deepSearchDetails('referal', details);
            try {
                const data = yield this.User.find(referalInformation);
                if (data) {
                    return { status: true, data: data.map((user) => (new user_dto_1.default(user)).getUnSecureResponse) };
                }
                else {
                    return { status: false, error: `Can't find Details` };
                }
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return { status: false, error };
            }
        });
        this.User = exports.User;
    }
    get createAnalytics() {
        return {
            totalUploaded: 0,
            totalCompleted: 0,
            raiders: {
                totalUploaded: 0,
                totalCompleted: 0,
            },
            moderators: {
                totalUploaded: 0,
                totalCompleted: 0,
            },
            chatEngagers: {
                totalUploaded: 0,
                totalCompleted: 0,
            },
            collabManagers: {
                totalUploaded: 0,
                totalCompleted: 0,
            }
        };
    }
}
exports.default = UserModel;
