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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
//@ts-check
//User Schema
const mongoose_1 = require("mongoose");
const logger_1 = require("../../logger");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    emailAddress: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
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
    authenticationCode: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
});
exports.Store = (0, mongoose_1.model)("Admin", UserSchema);
class AdminModel {
    constructor() {
        this.saveAdminToDB = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Store.create(details);
                if (data) {
                    return { status: true, data };
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
        this.updateAdminDetailToDB = (id, details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Store.findByIdAndUpdate(id, details, { new: true });
                if (data) {
                    return { status: true, data };
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
                const data = yield this.Store.findOne(details);
                if (data) {
                    return { status: true, data };
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
        this.deleteAdminFromDb = (details) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.Store.findOneAndDelete(details);
                if (data) {
                    return { status: true, data };
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
        this.Store = exports.Store;
    }
}
exports.default = AdminModel;
