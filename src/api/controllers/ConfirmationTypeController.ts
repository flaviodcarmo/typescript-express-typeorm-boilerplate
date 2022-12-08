import ConfirmationType from "../../entities/ConfirmationType";
import ConfirmationTypeBO from "../../business/ConfirmationTypeBO";
import { Request, Response } from 'express';
import BaseController from "./BaseController";
import Result from "../../util/Result";
import Filter from "../../util/Filter";

class ConfirmationTypeController extends BaseController<ConfirmationTypeBO> {
    constructor(req: Request, res: Response) {
        super(req, res, ConfirmationTypeBO);
    }

    async getByParameters() : Promise<Response> {
        try {
            let confirmationTypes : Array<ConfirmationType> = [];
            let filters : Filter = {};
            let query : Filter = this.req.query;

            if(query.id && typeof query.id === 'string'){
                filters.id = query.id;
            }
    
            if(query.name && typeof query.name === 'string'){
                filters.name = query.name;
            }
    
            confirmationTypes = await this.bo.getByParameters(filters);
            return this.res.status(200).json(confirmationTypes);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar os tipos de confirmações.']);
        }
    }

    async getById() : Promise<Response> {
        try {
            let confirmationType : ConfirmationType;
            let filters : Filter = {};
            let params : Filter = this.req.params;
    
            if(params.id && typeof params.id === 'string'){
                filters.id = params.id;
            }
    
            confirmationType = (await this.bo.getByParameters(filters))[0];
            if(confirmationType === undefined){
                return this.res.status(404).json({});
            } else {
                return this.res.status(200).json(confirmationType);
            }
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar o tipo de confirmação.']);
        }
    }

    async insert() : Promise<Response> {
        let r : Result = new Result();
        let confirmationType : ConfirmationType = new ConfirmationType();

        if(this.req.body && this.req.body.name && typeof this.req.body.name === 'string'){
            confirmationType.name = this.req.body.name;
        }

        r = await this.bo.save(confirmationType);
        if(r.isError === true){
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(201).json(r.returnObject);
        }
    }

    async update() : Promise<Response> {
        let r : Result = new Result();
        let confirmationType : ConfirmationType = new ConfirmationType();

        if(this.req.params && this.req.params.id && typeof this.req.params.id === 'string'){
            confirmationType.id = this.req.params.id;
        }

        if(this.req.body && this.req.body.name && typeof this.req.body.name === 'string'){
            confirmationType.name = this.req.body.name;
        }

        r = await this.bo.save(confirmationType);
        if(r.isError === true){
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(200).json(r.returnObject);
        }
    }

    async delete() : Promise<Response> {
        let r : Result = new Result();
        let confirmationType : ConfirmationType = new ConfirmationType();

        if(this.req.params && this.req.params.id && typeof this.req.params.id === 'string'){
            confirmationType.id = this.req.params.id;
        }

        r = await this.bo.delete(confirmationType);
        if(r.isError === true){
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(200).json(r.returnObject);
        }
    }
}

export default ConfirmationTypeController;