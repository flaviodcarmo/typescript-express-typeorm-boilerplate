import User from "../../entities/User";
import UserBO from "../../business/UserBO";
import { Request, Response } from 'express';
import BaseController from "./BaseController";
import Result from "../../util/Result";
import Filter from "../../util/Filter";

class UserController extends BaseController<UserBO> {
    private result          : Result;

    constructor(req: Request, res: Response) {
        super(req, res, UserBO);
    }

    async getByParameters() : Promise<Response> {
        try {
            let users : Array<User> = [];
            let filters : Filter = {};
            let query : Filter = this.req.query;
    
            if(query.id && typeof query.id === 'string'){
                filters.id = query.id;
            }
    
            if(query.name && typeof query.name === 'string'){
                filters.name = query.name;
            }
    
            if(query.birthDay && typeof query.birthDay === 'string'){
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

            if(params.id && typeof params.id === 'string'){
                filters.id = params.id;
            }

            user = (await this.bo.getByParameters(filters))[0];
            if(user === undefined){
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
        this.result = await this.bo.signup(this.req.body);

        if(this.result.isError === true){
            return this.res.status(this.result.httpCode).json(this.result.errors);
        } else {
            return this.res.status(201).json(this.result.returnObject);
        }
    }

    async auth(): Promise<Response> {
        this.result = await this.bo.auth(this.req.body);

        if(this.result.isError === true){
            return this.res.status(this.result.httpCode).json(this.result.errors);
        } else {
            return this.res.status(201).json(this.result.returnObject);
        }
    }

    async confirm(): Promise<Response> {
        try {
            let entity : Filter = {};

            entity.userId = this.req.params.id;
            entity.code = this.req.body.code;

            this.result = await this.bo.confirm(entity);
            if(this.result.isError === true) {
                return this.res.status(this.result.httpCode).json(this.result.errors);
            } else {
                return this.res.status(201).json(this.result.returnObject);
            }
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao confirmar o email.']);
        }
    }
}

export default UserController;