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
/* eslint-disable no-undef */
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
class DBConnection {
    constructor(logger) {
        this.connectForTest = () => __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'test') {
                this.mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
                this.dbUrl = this.mongod.getUri();
            }
        });
        this.connect = ({ config }) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.dbUrl = config.db.url;
                this.connectForTest();
                yield this.mongoose.connect(this.dbUrl);
                this.mongoose.connection.once('open', (err) => {
                    this.logger.info(`${config.name} database connected successfully`);
                });
            }
            catch (err) {
                this.logger.error(`Error: ${err}`);
                setTimeout(() => {
                    process.exit(1);
                }, 5000);
            }
        });
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.mongoose.connection.close();
                if (this.mongod) {
                    yield this.mongod.stop();
                }
            }
            catch (err) {
                console.log(err);
                process.exit(1);
            }
        });
        this.logger = logger;
        this.mongoose = mongoose_1.default;
        this.dbUrl = '';
    }
}
exports.default = DBConnection;
