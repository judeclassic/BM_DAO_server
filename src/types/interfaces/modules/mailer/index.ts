import EmailSubJectEnum from "../../../enums/email-subject-enum";

interface MailerRepoInterface {
    sendPasswordResetEmail: (to: string, info: { name: string, subject: EmailSubJectEnum, code: string }) => Promise<any>

    sendReminderEmail: (to: string, info: { name: string, subject: EmailSubJectEnum}) => Promise<any>

    sendVerificationEmail: (to: string, info: { name: string, subject: EmailSubJectEnum, code: string }) => Promise<any>
}

export default MailerRepoInterface;
