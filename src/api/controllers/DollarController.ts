import User from "../../entities/User";
import Dollar from "../../entities/Dollar";
import DollarBO from "../../business/DollarBO";
import DollarDAO from "../../daos/DollarDAO";
import { Request, Response } from 'express';
import Filter from "../../util/Filter";
import BaseController from "./BaseController";

class DollarController extends BaseController<DollarBO> {
    private currentUser : User;
    private dao : DollarDAO;
    
    constructor(req : Request, res : Response) {
        super(req, res, DollarBO);
    }

    async getByParameters(filters: Filter = {}) : Promise<Response> {
        try {
            let dollarRates : Array<Dollar>;
            let filters : Filter = {};
            let query : Filter = this.req.query;

            if (typeof query?.id === 'string') {
                filters.id = query.id;
            }
    
            if (typeof query?.date === 'string') {
                filters.refDate = query.date;
            }
    
            dollarRates = await this.bo.searchAll(filters);
            return this.res.status(200).json(dollarRates);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar as cotações do dólar.']);
        }
    }
}

export default DollarController;