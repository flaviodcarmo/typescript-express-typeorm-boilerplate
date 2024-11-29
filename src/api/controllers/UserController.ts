import User from "../../entities/User";
import UserBO from "../../business/UserBO";
import { Request, Response } from 'express';
import BaseController from "./BaseController";
import Result from "../../util/Result";
import Filter from "../../util/Filter";

class UserController extends BaseController<UserBO> {
    constructor(req: Request, res: Response) {
        super(req, res, UserBO);
    }

    async getByParameters() : Promise<Response> {
        try {
            let users : Array<User> = [];
            let filters : Filter = {};
            let query : Filter = this.req.query;
    
            if (typeof query?.id === 'string') {
                filters.id = query.id;
            }
    
            if (typeof query?.name === 'string') {
                filters.name = query.name;
            }
    
            if (typeof query?.birthDay === 'string') {
                filters.birthDay = query.birthDay;
            }
    
            users = await this.bo.getByParameters(filters);
            return this.res.status(200).json(users);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json('Ocorreu um erro ao buscar os usuários');
        }
    }

    async getById() : Promise<Response> {
        try {
            let user : User;
            let filters : Filter = {};
            let params : Filter = this.req.params;

            if (typeof params?.id === 'string') {
                filters.id = params.id;
            }

            user = (await this.bo.getByParameters(filters))[0];
            if (user === undefined) {
                return this.res.status(404).json({});
            } else {
                return this.res.status(200).json(user);
            }
        } catch(e) {
            console.error(e);
            return this.res.status(500).json('Ocorreu um erro ao buscar o usuário');
        }
    }

    async signup() : Promise<Response> {
        let r : Result;

        r = await this.bo.signup(this.req.body);

        if (r.isError === true) {
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(201).json(r.returnObject);
        }
    }

    async auth(): Promise<Response> {
        let r : Result;

        r = await this.bo.auth(this.req.body);

        if (r.isError === true) {
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(201).json(r.returnObject);
        }
    }

    async confirm(): Promise<Response> {
        try {
            let r : Result;
            let entity : Filter = {};

            entity.userId = this.req.params.id;
            entity.code = this.req.body.code;

            r = await this.bo.confirm(entity);
            if (r.isError === true) {
                return this.res.status(r.httpCode).json(r.errors);
            } else {
                return this.res.status(201).json(r.returnObject);
            }
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao confirmar o email.']);
        }
    }
}

export default UserController;