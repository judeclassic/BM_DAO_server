"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const auth_1 = require("../../../types/interfaces/modules/auth");
const config_1 = __importDefault(require("../../constant/config"));
const { accessTokenSecret, verifyEmailSecret, adminAccessTokenSecret } = config_1.default.auth;
class AuthorizationRepo {
    constructor() {
        this.getTokenKeyByType = (type) => {
            if (type === auth_1.TokenType.refreshToken) {
                return { key: `${verifyEmailSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 30 * 2 };
            }
            if (type === auth_1.TokenType.adminAccessToken) {
                return { key: `${adminAccessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 30 * 2 };
            }
            return { key: `${accessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 7, };
        };
        this.encryptToken = (data, type) => {
            const token = this.getTokenKeyByType(type);
            return this.jwt.sign(data, token.key, { expiresIn: token.expiresIn });
        };
        this.decryptToken = (data, type) => {
            return this.jwt.decode(data);
        };
        this.createSpecialKey = ({ prefix = '', suffix = '', removeDashes = false }) => {
            const secretKey = this.uuid().split('_').join('');
            if (removeDashes) {
                const secretKeyWithDashes = secretKey.split('_').join('');
                return `${prefix}${secretKeyWithDashes}${suffix}`;
            }
            return `${prefix}${secretKey}${suffix}`;
        };
        this.verifyBearerToken = (data, type) => {
            if (data === null || data === undefined) {
                return { status: false, error: 'Authentication Failed' };
            }
            const tokenKey = this.getTokenKeyByType(type);
            try {
                const token = data.split(" ", 2)[1];
                const decoded = this.jwt.verify(token, tokenKey.key);
                return { status: true, data: decoded };
            }
            catch (error) {
                return { status: false, error: 'Authentication Failed' };
            }
        };
        this.encryptPassword = (password) => {
            return this.bcrypt.hashSync(password, 10);
        };
        this.comparePassword = (password, userPassword) => {
            return this.bcrypt.compareSync(password, userPassword);
        };
        this.generateCode = (numb) => {
            const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
            const randomArray = Array.from({ length: numb }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);
            const randomString = randomArray.join("");
            return randomString;
        };
        this.generateVerificationCode = (numb) => {
            let verificationCode = Math.floor((Math.random() * (10 ** numb)) - 1).toString();
            if (verificationCode.length < 6) {
                verificationCode = this.addNumberWhenCodeIsLess(verificationCode);
            }
            return verificationCode;
        };
        this.addNumberWhenCodeIsLess = (code) => {
            if (code.length < 6) {
                code = '0' + code;
                code = this.addNumberWhenCodeIsLess(code);
            }
            return code;
        };
        this.key = 'key';
        this.jwt = jsonwebtoken_1.default;
        this.uuid = uuid_1.v4;
        this.bcrypt = bcryptjs_1.default;
    }
}
exports.default = AuthorizationRepo;
