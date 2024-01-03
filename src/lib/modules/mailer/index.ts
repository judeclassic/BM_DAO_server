//@ts-check
import nodeMailer, { SentMessageInfo } from 'nodemailer';
import fs from 'fs';
import path from  'path';
import { defaultLogger } from '../logger';
import Mail from 'nodemailer/lib/mailer';
import MailerRepoInterface from '../../../types/interfaces/modules/mailer';

const { DEFAULT_SMTP_FROM_EMAIL, DEFAULT_EMAIL_NAME, DEFAULT_SMTP_HOST, DEFAULT_SMTP_USER, DEFAULT_SMTP_PASSWORD } = process.env;

class MailerRepo implements MailerRepoInterface {
    transporter: Mail<SentMessageInfo>

    constructor(){
        this.transporter = this.initAmazon();
    }

    private initAmazon = ()=>{
        return nodeMailer.createTransport({
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
    }

    private initOutlook = ()=>{
        this.transporter = nodeMailer.createTransport({
            host: DEFAULT_SMTP_HOST, // hostnamee
            port: 587, // port for secure SMTP
            tls: {
                ciphers:'SSLv3'
            },// true for 465, false for other ports
            auth: {
                user: DEFAULT_SMTP_USER, // generated ethereal user
                pass: DEFAULT_SMTP_PASSWORD, // generated ethereal password
            },
        });
    }

    private initGmail = ()=>{
        this.transporter = nodeMailer.createTransport({
            host: DEFAULT_SMTP_HOST, // hostnamee
            port: 587, // port for secure SMTP
            tls: {
                ciphers:'SSLv3'
            },// true for 465, false for other ports
            auth: {
                user: DEFAULT_SMTP_USER, // generated ethereal user
                pass: DEFAULT_SMTP_PASSWORD, // generated ethereal password
            },
        });
    }

     private async sendEmail(message: { to: string, subject: string, html: string}) {
        try {
            return await this.transporter.sendMail({...message, from: `${DEFAULT_SMTP_FROM_EMAIL} ${DEFAULT_EMAIL_NAME}`});
            
        } catch (error) {
            defaultLogger.error(error);
            return error;
        }
    }

    public sendReminderEmail = async (to: string, info: { name: string, subject: string}) => {
        const { name, subject } = info;
        let htmlContent = fs.readFileSync(path.join(__dirname, './mails/reminder-mail.html')).toString();
        htmlContent = htmlContent.replace('{{name}}', name);
         
        const MAIL_CONTENT = {
            to: to, // list of receivers
            subject: subject, // Subject line
            html: htmlContent, // html body
        }
        
        return this.sendEmail(MAIL_CONTENT);
     }

    public sendVerificationEmail = async (to: string, info: { name: string, subject: string, code: string }) => {
        const { name, subject } = info;
        let htmlContent = fs.readFileSync(path.join(__dirname, './mails/verification-mail.html')).toString();
        htmlContent = htmlContent.replace('{{name}}', name);
         
        const MAIL_CONTENT = {
            to: to, // list of receivers
            subject: subject, // Subject line
            html: htmlContent, // html body
        }
        
        return this.sendEmail(MAIL_CONTENT);
     }
     
     public sendPasswordResetEmail = async (to: string, { name, code } : { name: string, subject: string, code: string }) => {
        let htmlContent = fs.readFileSync(path.join(__dirname, './mails/password-reset-mail.html')).toString();
        htmlContent = htmlContent.replace('{{name}}', name);
        htmlContent = htmlContent.replace('{{code}}', code);
         
        const MAIL_CONTENT = {
            to: to,
            subject: "Reset Password Email",
            html: htmlContent,
        }
        
        return this.sendEmail(MAIL_CONTENT);
     };
}

export default MailerRepo;
