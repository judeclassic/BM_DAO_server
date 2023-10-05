"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
process.env.NODE_ENV !== 'production' && dotenv_1.default.config();
const config = {
    name: process.env.APP_NAME || 'Bakely-store',
    server: {
        port: process.env.PORT || 8081
    },
    db: {
        url: process.env.MONGODB_URL
    },
    file: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    },
    auth: {
        userAuthKey: process.env.USER_AUTHENTICATION_KEY,
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        verifyEmailSecret: process.env.VERIFY_EMAIL_SECRET,
        passwordResetSecret: process.env.RESET_PASSWORD_SECRET,
        adminAccessTokenSecret: process.env.ADMIN_ACCESS_TOKEN_SECRET,
    },
    options: {
        key: process.env.PRODUCTION_KEY,
        cert: process.env.PRODUCTION_CERT
    },
    emailSmtp: {
        fromEmail: process.env.DEFAULT_SMTP_FROM_EMAIL,
        user: process.env.DEFAULT_SMTP_USER,
        password: process.env.DEFAULT_SMTP_PASSWORD,
        host: process.env.DEFAULT_SMTP_HOST
    },
    socketCorsSettings: {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    },
    payment: {
        paystackSecretKey: process.env.PAYSTACK_SK_LIVE,
    }
};
exports.default = config;
