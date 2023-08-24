//@ts-check
import nodeMailer, { SentMessageInfo } from 'nodemailer';
import fs from 'fs';
import path from  'path';
import { defaultLogger } from '../logger';
import Mail from 'nodemailer/lib/mailer';

const { DEFAULT_SMTP_FROM_EMAIL, DEFAULT_EMAIL_NAME, DEFAULT_SMTP_HOST, DEFAULT_SMTP_USER, DEFAULT_SMTP_PASSWORD } = process.env;

class MailerRepo {
    transporter: Mail<SentMessageInfo>

    constructor(){
        this.transporter = this.initOutlook();
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
        return nodeMailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'nftchampions123@gmail.com',
              pass: 'Secure@24'
            }
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

    public sendVerificationEmail = async (to: string, info: { name: string, subject: string, code: string }) => {
        const { name, code, subject } = info;
        let htmlContent = fs.readFileSync(path.join(__dirname, './mails/verification-mail.html')).toString();
        htmlContent = htmlContent.replace('{{name}}', name);
        htmlContent = htmlContent.replace('{{code}}', code);
         
        const MAIL_CONTENT = {
            to: to, // list of receivers
            subject: subject, // Subject line
            html: htmlContent, // html body
        }
        
        return this.sendEmail(MAIL_CONTENT);
     }
}

export default MailerRepo;
