import Result from "../util/Result";
import * as nodemailer from "nodemailer";
import { settings } from "../config/settings";

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

            return Result.returnSuccess('O email foi enviado com sucesso!');
        } catch(e) {
            console.error(e);
            return Result.returnError(e.message);
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
                return Result.returnErrors(errors);
            }

            return Result.returnSuccess();
        } catch(e) {
            return Result.returnError(e.message);
        }
    }
}

export default MailUtil;