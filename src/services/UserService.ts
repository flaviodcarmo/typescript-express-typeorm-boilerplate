import User from "../entities/User";
import UserBO from "../business/UserBO";
import ConfirmationTypeBO from "../business/ConfirmationTypeBO";
import { constants } from "../util/Constants";
import Result from "../util/Result";
import Confirmation from "../entities/Confirmation";
import AppUtil from "../util/AppUtil";
import MailUtil from "../util/MailUtil";

class UserService {
    bo : UserBO;
    confirmationTypeBO : ConfirmationTypeBO;
    currentUser : User;
    r : Result;
    appUtil : AppUtil;
    mailUtil : MailUtil;

    constructor() {
        this.r = new Result();

        let user : User = new User();
        user.id = constants.userAdministrator.ID;
        user.profileId = constants.profile.ADMINISTRATOR_ID;
        this.currentUser = user;

        this.bo = new UserBO(user);
        this.confirmationTypeBO = new ConfirmationTypeBO(user);

        this.appUtil = new AppUtil();
        this.mailUtil = new MailUtil();
    }

    async sendMailToConfirmation () : Promise<Result> {
        try {
            let r : Result = new Result();
            let users : Array<User>;
            let confirmation : Confirmation = new Confirmation();

            users = await this.bo.searchAll({ isSentMail: false, isConfirmed: false});
            console.info('Será enviado email de confirmação para ' + users.length + ' usuários.')
            for(let user of users) {
                confirmation                    = new Confirmation();

                confirmation.id                 = await this.appUtil.getNewId();
                confirmation.userId             = user.id;
                confirmation.code               = await this.appUtil.generateConfirmationCode();
                confirmation.typeId             = constants.confirmationType.USER_REGISTRATION_SIGN_IN_ID;
                confirmation.createdByUserId    = this.currentUser.id;
                confirmation.createdDate        = new Date();
                
                confirmation = await confirmation.save();

                r = await this.mailUtil.sendMail(user.email, 'Código de confirmação de email', confirmation.code);
                if(r.isError === false) {
                    user.updatedByUserId                = this.currentUser.id;
                    user.updatedDate                    = new Date();
                    user.isSentMail                     = true;

                    user = await user.save();
                }
            }

            return r;
        } catch(e) {
            console.error(e);
            return Result.returnError((e as Error).message);
        }
    }
}

export default UserService;