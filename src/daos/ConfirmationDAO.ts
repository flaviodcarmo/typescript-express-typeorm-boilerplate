import User from "../entities/User";
import Confirmation from "../entities/Confirmation";
import { DataSource, Like, MoreThan } from "typeorm";
import moment from 'moment';
import Filter from "../util/Filter";

class ConfirmationDAO {
    private currentUser : User;

    constructor(currentUser : User){
        this.currentUser = currentUser;
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Confirmation>> {
        filters.where = {};

        if(typeof filters.id === "string"){
            filters.where.id = filters.id;
        }

        if(typeof filters.userId === "string"){
            filters.where.userId = filters.userId;
        }

        if(typeof filters.code === "string"){
            filters.where.code = filters.code;
        }

        if(typeof filters.validateLimiteValidation === "boolean" && filters.validateLimiteValidation === true){
            filters.where.createdDate = MoreThan(moment().add(-60, 'minutes').format('yyyy-MM-DD HH:mm:ss'));
        }

        if(typeof filters.typeId === "string"){
            filters.where.typeId = filters.typeId;
        }

        filters.where.isEnabled = true;
        return await Confirmation.getRepository().find(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Confirmation>> {
        filters.where = {};

        if(typeof filters.id === "string"){
            filters.where.id = filters.id;
        }

        if(typeof filters.userId === "string"){
            filters.where.userId = filters.userId;
        }

        if(typeof filters.code === "string"){
            filters.where.code = filters.code;
        }

        if(typeof filters.typeId === "string"){
            filters.where.typeId = filters.typeId;
        }

        filters.where.isEnabled = true;
        return await Confirmation.getRepository().find(filters);
    }
}

export default ConfirmationDAO;