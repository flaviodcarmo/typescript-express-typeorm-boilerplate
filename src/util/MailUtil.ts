import Result from "../util/Result";
import * as nodemailer from "nodemailer";
import { settings } from "../config/settings";
import e from "cors";

class MailUtil {
    r : Result;

    constructor() {
        this.r = new Result();
    }

    async sendMail(to : string, subject : string, message : string) : Promise<Result> {
        try {
            let transporter : any;
            let info : any;

            this.r = await this.validateSendMail(to, subject, message);
            if(this.r.isError) {
                return this.r;
            }

            transporter = nodemailer.createTransport({
                service: 'hotmail',
                auth: {
                    user: settings.MAIL.USER,
                    pass: settings.MAIL.PASSWORD
                }
            });

            info = await transporter.sendMail({
                from: settings.MAIL.FROM, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: message
            });

            console.info('O email foi enviado com sucesso!');
            this.r.returnSuccess('O email foi enviado com sucesso!');

            return this.r;
        } catch(e) {
            console.error(e);

            this.r.returnError(e.message);
            return this.r;
        }
    }

    async validateSendMail(to : string, subject : string, message : string) : Promise<Result> {
        try {
            let errors : Array<string> = [];

            if(typeof to !== "string" || to.trim() === ""){
                errors.push('O destinatário é inválido!');
            }

            if(typeof subject !== "string" || subject.trim() === ""){
                errors.push('O assunto é inválido!');
            }

            if(typeof message !== "string" || message.trim() === ""){
                errors.push('O destinatário é inválido!');
            }

            if(errors.length > 0) {
                this.r.returnErrors(errors);
            }

            return this.r;
        } catch(e) {
            this.r.returnError(e.message);
            return this.r;
        }
    }
}

export default MailUtil;