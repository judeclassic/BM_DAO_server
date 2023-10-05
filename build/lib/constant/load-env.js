"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const loadEnv = () => {
    dotenv_1.default.config();
    if (process.env.NODE_ENV == 'development') {
        dotenv_1.default.config({ path: '../.env' });
    }
    if (process.env.NODE_ENV == 'production') {
        dotenv_1.default.config({ path: '/home/ubuntu/.env' });
    }
    if (process.env.APP_NAME == null) {
        throw new Error('APP_NAME environment variable missing.');
    }
    if (process.env.PORT == null) {
        throw new Error('PORT environment variable missing.');
    }
    if (process.env.MONGODB_URL == null) {
        throw new Error('MONGODB_URL environment variable missing.');
    }
    if (process.env.ACCESS_TOKEN_SECRET == null) {
        throw new Error('ACCESS_TOKEN_SECRET environment variable missing.');
    }
    if (process.env.VERIFY_EMAIL_SECRET == null) {
        throw new Error('VERIFY_EMAIL_SECRET environment variable missing.');
    }
    if (process.env.RESET_PASSWORD_SECRET == null) {
        throw new Error('RESET_PASSWORD_SECRET environment variable missing.');
    }
    if (process.env.USER_AUTHENTICATION_KEY == null) {
        throw new Error('USER_AUTHENTICATION_KEY environment variable missing.');
    }
};
exports.default = loadEnv;
