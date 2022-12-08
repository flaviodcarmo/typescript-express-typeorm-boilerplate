import User from "../entities/User";
import Password from "../entities/Password";
import { DataSource, Like } from "typeorm";
import { stringify } from "querystring";
import Filter from "../util/Filter";

class PasswordDAO {
    private currentUser : User;

    constructor(currentUser : User){
        this.currentUser = currentUser;
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Password>> {
        filters.where = {};

        if(typeof filters.id === "string"){
            filters.where.id = filters.id;
        }

        if(typeof filters.userId === "string"){
            filters.where.userId = filters.userId;
        }

        if(typeof filters.hash === "string"){
            filters.where.hash = filters.hash;
        }

        filters.where.isEnabled = true;
        return await Password.getRepository().find(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Password>> {
        filters.where = {};

        if(typeof filters.id === "string"){
            filters.where.id = filters.id;
        }

        if(typeof filters.userId === "string"){
            filters.where.userId = filters.userId;
        }

        if(typeof filters.hash === "string"){
            filters.where.hash = filters.hash;
        }

        filters.where.isEnabled = true;
        return await Password.getRepository().find(filters);
    }
}

export default PasswordDAO;