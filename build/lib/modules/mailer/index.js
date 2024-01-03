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
//@ts-check
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../logger");
const { DEFAULT_SMTP_FROM_EMAIL, DEFAULT_EMAIL_NAME, DEFAULT_SMTP_HOST, DEFAULT_SMTP_USER, DEFAULT_SMTP_PASSWORD } = process.env;
class MailerRepo {
    constructor() {
        this.initAmazon = () => {
            return nodemailer_1.default.createTransport({
                pool: true,
                maxConnections: 1,
                host: DEFAULT_SMTP_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: DEFAULT_SMTP_USER,
                    pass: DEFAULT_SMTP_PASSWORD,
                },
            });
        };
        this.initOutlook = () => {
            this.transporter = nodemailer_1.default.createTransport({
                host: DEFAULT_SMTP_HOST,
                port: 587,
                tls: {
                    ciphers: 'SSLv3'
                },
                auth: {
                    user: DEFAULT_SMTP_USER,
                    pass: DEFAULT_SMTP_PASSWORD, // generated ethereal password
                },
            });
        };
        this.initGmail = () => {
            this.transporter = nodemailer_1.default.createTransport({
                host: DEFAULT_SMTP_HOST,
                port: 587,
                tls: {
                    ciphers: 'SSLv3'
                },
                auth: {
                    user: DEFAULT_SMTP_USER,
                    pass: DEFAULT_SMTP_PASSWORD, // generated ethereal password
                },
            });
        };
        this.sendReminderEmail = (to, info) => __awaiter(this, void 0, void 0, function* () {
            const { name, subject } = info;
            let htmlContent = fs_1.default.readFileSync(path_1.default.join(__dirname, './mails/reminder-mail.html')).toString();
            htmlContent = htmlContent.replace('{{name}}', name);
            const MAIL_CONTENT = {
                to: to,
                subject: subject,
                html: htmlContent, // html body
            };
            return this.sendEmail(MAIL_CONTENT);
        });
        this.sendVerificationEmail = (to, info) => __awaiter(this, void 0, void 0, function* () {
            const { name, subject } = info;
            let htmlContent = fs_1.default.readFileSync(path_1.default.join(__dirname, './mails/verification-mail.html')).toString();
            htmlContent = htmlContent.replace('{{name}}', name);
            const MAIL_CONTENT = {
                to: to,
                subject: subject,
                html: htmlContent, // html body
            };
            return this.sendEmail(MAIL_CONTENT);
        });
        this.sendPasswordResetEmail = (to, { name, code }) => __awaiter(this, void 0, void 0, function* () {
            let htmlContent = fs_1.default.readFileSync(path_1.default.join(__dirname, './mails/password-reset-mail.html')).toString();
            htmlContent = htmlContent.replace('{{name}}', name);
            htmlContent = htmlContent.replace('{{code}}', code);
            const MAIL_CONTENT = {
                to: to,
                subject: "Reset Password Email",
                html: htmlContent,
            };
            return this.sendEmail(MAIL_CONTENT);
        });
        this.transporter = this.initAmazon();
    }
    sendEmail(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.transporter.sendMail(Object.assign(Object.assign({}, message), { from: `${DEFAULT_SMTP_FROM_EMAIL} ${DEFAULT_EMAIL_NAME}` }));
            }
            catch (error) {
                logger_1.defaultLogger.error(error);
                return error;
            }
        });
    }
}
exports.default = MailerRepo;
