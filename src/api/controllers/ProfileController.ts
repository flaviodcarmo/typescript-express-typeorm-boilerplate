import User from "../../entities/User";
import Profile from "../../entities/Profile";
import ProfileBO from "../../business/ProfileBO";
import ProfileDAO from "../../daos/ProfileDAO";
import BaseController from "./BaseController";
import { Request, Response } from 'express';
import Result from "../../util/Result";
import Filter from "../../util/Filter";

class ProfileController extends BaseController<ProfileBO> {
    private currentUser : User;
    private dao : ProfileDAO;
    
    constructor(req: Request, res: Response) {
        super(req, res, ProfileBO);
    }

    async searchAll(filters: Filter = {}) : Promise<Response> {
        try {
            let profiles : Array<Profile>;
            let filters : Filter = {};
            let query : Filter = this.req.query;

            if (typeof query?.id === 'string') {
                filters.id = query.id;
            }
    
            if (typeof query?.name === 'string') {
                filters.name = query.name;
            }
    
            profiles = await this.bo.searchAll(filters);
            return this.res.status(200).json(profiles);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar os perfis.']);
        }
    }

    async getByParameters(filters: Filter = {}) : Promise<Response> {
        try {
            let profiles : Array<Profile>;
            let filters : Filter = {};
            let query : Filter = this.req.query;

            if (typeof query?.id === 'string') {
                filters.id = query.id;
            }
    
            if (typeof query?.name === 'string') {
                filters.name = query.name;
            }
    
            profiles = await this.bo.getByParameters(filters);
            return this.res.status(200).json(profiles);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar os perfis.']);
        }
    }

    async getById() : Promise<Response> {
        try {
            let profile : Profile;
            let filters : Filter = {};
            let params : Filter = this.req.params;
    
            if (typeof params?.id === 'string') {
                filters.id = params.id;
            }
    
            profile = (await this.bo.getByParameters(filters))[0];
            if (profile === undefined) {
                return this.res.status(404).json({});
            } else {
                return this.res.status(200).json(profile);
            }
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar o perfil.']);
        }
    }

    async insert() : Promise<Response> {
        let r : Result;
        let profile : Profile = new Profile();

        if (typeof this.req?.body?.name === 'string') {
            profile.name = this.req.body.name;
        }
        
        r = await this.bo.save(profile);
        if (r.isError === true) {
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(201).json(r.returnObject);
        }
    }

    async update() : Promise<Response> {
        let r : Result;
        let profile : Profile = new Profile();

        if (typeof this.req?.params?.id === 'string') {
            profile.id = this.req.params.id;
        }

        if (typeof this.req?.body?.name === 'string') {
            profile.name = this.req.body.name;
        }

        r = await this.bo.save(profile);
        if (r.isError === true) {
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(200).json(r.returnObject);
        }
    }

    async delete() : Promise<Response> {
        let r : Result;
        let profile : Profile = new Profile();

        if (typeof this.req?.params?.id === 'string') {
            profile.id = this.req.params.id;
        }

        r = await this.bo.delete(profile);
        if (r.isError === true) {
            return this.res.status(r.httpCode).json(r.errors);
        } else {
            return this.res.status(200).json(r.returnObject);
        }
    }
}

export default ProfileController;