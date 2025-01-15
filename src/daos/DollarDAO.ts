import Dollar from "../entities/Dollar";
import Filter from "../util/Filter";
import { Between } from 'typeorm';
import moment from "moment";

class DollarDAO {
    constructor() {
        
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Dollar>> {
        filters.where = {};

        if (typeof filters.id === "string") {
            filters.where.id = filters.id;
        }

        if (typeof filters.refDate === "string") {
            filters.where.refDate = Between(filters.refDate, moment(filters.refDate).add(1, 'days').format('yyyy-MM-DD'));
        }

        if (typeof filters.createdByUserId === "string") {
            filters.where.createdByUserId = filters.createdByUserId;
        }
    
        filters.where.isEnabled = true;

        console.log(filters)
        return await Dollar.getRepository().find(filters);
    }
}

export default DollarDAO;