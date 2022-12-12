import Result from "../util/Result";
import User from "../entities/User";
import Confirmation from "../entities/Confirmation";
import UserDAO from "../daos/UserDAO";
import moment from 'moment';
import bcrypt from 'bcrypt';
import Password from "../entities/Password";
import PasswordBO from "./PasswordBO";
import ConfirmationBO from "./ConfirmationBO";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { settings } from "../config/settings";
import { constants } from "../util/Constants";
import AppUtil from "../util/AppUtil";
import Filter from "../util/Filter";

class UserBO {
    private currentUser : User;
    private dao : UserDAO;
    private result : Result;
    private passwordBo : PasswordBO;
    private secretKey : string;
    private appUtil : AppUtil;
    
    constructor(currentUser : User){
        this.currentUser = currentUser;
        this.dao = new UserDAO(currentUser);
        this.result = new Result();
        this.passwordBo = new PasswordBO(currentUser);
        this.secretKey = settings.SECRET_KEY;
        this.appUtil = new AppUtil();
    }

    async searchAll(filters: Filter = {}) : Promise<Array<User>> {
        return await this.dao.searchAll(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<User>> {
        if(this.currentUser.profileId !== constants.profile.ADMINISTRATOR_ID){
            filters.id = this.currentUser.id;
        }

        return await this.dao.getByParameters(filters);
    }
    
    async signup(entity: Filter = {}) : Promise<Result> {
        try {
            let r : Result = new Result();
            let user : User;
            let password : Password = new Password();

            r = await this.validateSave(entity);
            if(r.isError === true) {
                return r;
            }
            entity = r.returnObject;

            entity.password = await this.passwordToHash(entity.password);

            user = await this.parseUser(entity);
            user.id = await this.appUtil.getNewId();
            user.profileId = constants.profile.USER_ID;
            user.createdByUserId = user.id;

            user = await user.save();
            this.currentUser = user;

            password.id = await this.appUtil.getNewId();
            password.userId = user.id;
            password.hash = entity.password;
            password.createdByUserId = user.id;
            password = await password.save();

            user = (await this.getByParameters({ id: user.id }))[0];
            return new Result().returnSuccess(user);
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao cadastrar um usuário.');
        }
    }

    async validateSave(entity : Filter = null) : Promise<Result> {
        try {
            let errors : Array<string> = [];
            let user : User | undefined;

            if(typeof entity.name !== "string" || entity.name.trim() === ""){
                errors.push('O nome é de preenchimento obrigatório!');
            } else {
                entity.name = entity.name.trim();
            }

            if(typeof entity.email !== "string" || entity.email.trim() === ""){
                errors.push('O email é de preenchimento obrigatório!');
            } else if(await this.validateEmail(entity.email.trim()) === false){
                errors.push('O email é inválido!');
            } else {
                entity.email = entity.email.trim();

                user = (await this.searchAll({
                    email: entity.email
                }))[0];
                if(user as User) {
                    errors.push('Existe uma conta cadastrada com o email informado!');
                }
            }

            if(typeof entity.birthDay !== "string" || entity.birthDay.trim() === ""){
                errors.push('A data de nascimento é de preenchimento obrigatório!');
            } else if(moment(entity.birthDay, 'YYYY-MM-DD', true).isValid() === false){
                errors.push('A data de nascimento é inválida!');
            }

            if(typeof entity.password !== "string" || entity.password.trim() === ""){
                errors.push('A senha é de preenchimento obrigatório!');
            } else if(typeof entity.confirmPassword !== "string" || entity.confirmPassword.trim() === ""){
                errors.push('A senha de confirmação é de preenchimento obrigatório!');
            } else if(entity.password !== entity.confirmPassword){
                errors.push('A senha de confirmação é diferente da senha informada!');
            }

            if(errors.length > 0) {
                return new Result().returnErrors(errors, 422);
            }

            return new Result().returnSuccess(entity);
        } catch(e) {
            return new Result().returnError(e.message);
        }
    }

    async parseUser(entity : Filter = {}) : Promise<User> {
        let user : User = new User();

        user.name               = entity.name ? entity.name : user.name;
        user.email              = entity.email ? entity.email : user.email;
        user.birthDay           = entity.birthDay ? entity.birthDay : user.birthDay;
        user.profileId          = entity.profileId ? entity.profileId : user.profileId;

        return user;
    }

    async validateEmail(email : string) : Promise<boolean> {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return expression.test(email); // true
    }

    async passwordToHash(password : string) : Promise<string> {
        const salt : string = await bcrypt.genSalt(10);
        return bcrypt.hashSync(password, salt);
    }

    async auth(entity : Filter = {}) : Promise<Result> {
        try {
            let r : Result = new Result();
            let user : User;

            r = await this.validateAuth(entity);
            if(r.isError === true) {
                return r;
            }
            user = r.returnObject as User;

            const token = jwt.sign({ userId: user.id, profileId: user.profileId }, this.secretKey, {
                expiresIn: '2 days',
            });

            delete user.profileId;

            r.returnObject = {
                user: user,
                token: token
            };

            return r;
        } catch(e) {
            console.error(e);
            return this.result.returnError('Ocorreu um erro ao logar no sistema.');
        }
    }

    async validateAuth(entity : Filter = {}) : Promise<Result> {
        try {
            let user : User | undefined;
            let password : Password | undefined;
            let errors : Array<string> = [];

            if(typeof entity.email !== "string" || entity.email.trim() === ""){
                errors.push('O email é de preenchimento obrigatório!');
            }

            if(typeof entity.password !== "string" || entity.password.trim() === ""){
                errors.push('A senha é de preenchimento obrigatório!');
            }

            if(errors.length > 0) {
                return new Result().returnErrors(errors, 422);
            }

            user = (await this.searchAll({ email: entity.email }))[0];
            if(user === undefined) {
                return new Result().returnError('O email ou a senha é inválida.', 401);
            }

            password = (await this.passwordBo.searchAll({ userId: user.id }))[0];
            if(password === undefined) {
                return new Result().returnError('O email ou a senha é inválida.', 401);
            }

            if(bcrypt.compareSync(entity.password, password.hash) === false) {
                return new Result().returnError('O email ou a senha é inválida.', 401);
            }

            if(user.isConfirmed === 0) {
                return new Result().returnError('É necessário confirmar a conta com o código recebido.', 401);
            }

            return new Result().returnSuccess(user);
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao logar no sistema.');
        }
    }

    async confirm(entity : Filter = {}) : Promise<Result> {
        try {
            let r : Result = new Result();
            let user : User;

            r = await this.validateConfirm(entity);
            if(r.isError === true){
                return r;
            }
            user = r.returnObject as User;

            user.updatedDate = new Date();
            user.updatedByUserId = user.id;
            user.isConfirmed = 1;

            user = await user.save();

            return new Result().returnSuccess(['O email foi confirmado com sucesso!']);
        } catch(e) {
            console.error(e);
            return new Result().returnError(e.message, 500);
        }
    }

    async validateConfirm(entity : Filter = {}) : Promise<Result> {
        try {
            let errors : Array<string> = [];
            let user : User | undefined;
            let confirmation : Confirmation | undefined;

            if(typeof entity.userId !== "string" || entity.userId === "") {
                errors.push('O usuário é de preenchimento obrigatório!');
            } else if(typeof entity.userId === "string" && entity.userId.length != 36) {
                errors.push('O usuário informado é inválido!');
            }

            if(typeof entity.code !== "string" || entity.code === "") {
                errors.push('O código é de preenchimento obrigatório!');
            } else if(typeof entity.code === "string" && entity.code.length != 6) {
                errors.push('O código informado é inválido!');
            } else if(Number.isNaN(entity.code) === true) {
                errors.push('O código informado é inválido!');
            }

            if(errors.length > 0) {
                return new Result().returnErrors(errors, 422);
            }

            user = (await this.searchAll({ id: entity.userId }))[0];
            if(user === undefined) {
                return new Result().returnError('O usuário informado é inválido!', 422);
            } else if(user.isConfirmed) {
                return new Result().returnError('O usuário informado já está validado!', 422);
            }

            confirmation = (await new ConfirmationBO(user).searchAll({ 
                userId: user.id, 
                code: entity.code, 
                validateLimiteValidation: true,
                typeId: constants.confirmationType.USER_REGISTRATION_ID
            }))[0];
            if(confirmation === undefined) {
                return new Result().returnError('O usuário e/ou código de confirmação são inválidos!', 422);
            }

            return new Result().returnSuccess(user);
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao validar a confirmação de email.', 500);
        }
    }
}

export default UserBO;