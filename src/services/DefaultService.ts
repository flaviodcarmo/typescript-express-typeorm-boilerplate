import User from "../entities/User";
import Profile from "../entities/Profile";
import ConfirmationType from "../entities/ConfirmationType";
import Password from "../entities/Password";
import UserBO from "../business/UserBO";
import ProfileBO from "../business/ProfileBO";
import ConfirmationTypeBO from "../business/ConfirmationTypeBO";
import { constants } from "../util/Constants";
import Result from "../util/Result";
import AppUtil from "../util/AppUtil";
import MailUtil from "../util/MailUtil";
import { httpRequestUtil } from "../util/HttpRequestUtil";
import moment from "moment";

class DefaultService {
    r : Result = new Result();
    userBo : UserBO;
    profileBo : ProfileBO;
    confirmationTypeBO : ConfirmationTypeBO;
    currentUser : User;
    appUtil : AppUtil;
    mailUtil : MailUtil;

    constructor() {
        let user : User = new User();
        user.id = constants.userAdministrator.ID;
        user.profileId = constants.profile.ADMINISTRATOR_ID;
        this.currentUser = user;

        this.userBo = new UserBO(user);
        this.profileBo = new ProfileBO(user);
        this.confirmationTypeBO = new ConfirmationTypeBO(user);

        this.appUtil = new AppUtil();
        this.mailUtil = new MailUtil();
    }

    async createDefaultData() : Promise<Result> {
        try {
            let admUser : User;
            let regularUser : User;
            let profile : Profile;
            let confirmationType : ConfirmationType;
            let password : Password = new Password();

            //create administrator user id
            admUser = (await this.userBo.searchAll({ id: constants.userAdministrator.ID }))[0];
            if (admUser === undefined) {
                admUser = new User();

                admUser.id = constants.userAdministrator.ID;
                admUser.name = constants.userAdministrator.NAME;
                admUser.email = constants.userAdministrator.EMAIL;
                admUser.birthDay = moment().format("YYYY-MM-DD");
                admUser.profileId = null;
                admUser.isConfirmed = true;
                admUser.isSentMail = true;

                admUser.createdByUserId = admUser.id;

                admUser = await admUser.save();

                password.id = await this.appUtil.getNewId();
                password.userId = admUser.id;
                password.hash = await this.userBo.passwordToHash(constants.userAdministrator.PASSWORD);
                password.createdByUserId = admUser.id;
                password = await password.save();
            }

            //create regular user id
            regularUser = (await this.userBo.searchAll({ id: constants.userRegular.ID }))[0];
            if (regularUser === undefined) {
                regularUser = new User();

                regularUser.id = constants.userRegular.ID;
                regularUser.name = constants.userRegular.NAME;
                regularUser.email = constants.userRegular.EMAIL;
                regularUser.birthDay = moment().format("YYYY-MM-DD");
                regularUser.profileId = null;
                regularUser.isConfirmed = true;
                regularUser.isSentMail = true;

                regularUser.createdByUserId = regularUser.id;

                regularUser = await regularUser.save();

                password.id = await this.appUtil.getNewId();
                password.userId = regularUser.id;
                password.hash = await this.userBo.passwordToHash(constants.userRegular.PASSWORD);
                password.createdByUserId = regularUser.id;
                password = await password.save();
            }

            //create administrator profile id
            profile = (await this.profileBo.searchAll({ id: constants.profile.ADMINISTRATOR_ID }))[0];
            if (profile === undefined) {
                profile = new Profile();

                profile.id = constants.profile.ADMINISTRATOR_ID;
                profile.name = constants.userAdministrator.NAME;

                profile.createdByUserId = admUser.id;

                profile = await profile.save();

                admUser.profileId = profile.id;
                admUser = await admUser.save();
            }

            //create user profile id
            profile = (await this.profileBo.searchAll({ id: constants.profile.USER_ID }))[0];
            if (profile === undefined) {
                profile = new Profile();

                profile.id = constants.profile.USER_ID;
                profile.name = constants.profile.USER_NAME;

                profile.createdByUserId = admUser.id;

                profile = await profile.save();
                
                regularUser.profileId = profile.id;
                regularUser = await regularUser.save();
            }

            //create confirmationTypeSignIn
            confirmationType = (await this.confirmationTypeBO.searchAll({ id: constants.confirmationType.USER_REGISTRATION_SIGN_IN_ID }))[0];
            if (confirmationType === undefined) {
                confirmationType = new ConfirmationType();

                confirmationType.id = constants.confirmationType.USER_REGISTRATION_SIGN_IN_ID;
                confirmationType.name = constants.confirmationType.USER_REGISTRATION_SIGN_IN_NAME;

                confirmationType.createdByUserId = admUser.id;

                confirmationType = await confirmationType.save();
            }

            return Result.returnSuccess();
        } catch(e) {
            return Result.returnError((e as Error).message);
        }
    }
}

export default DefaultService;