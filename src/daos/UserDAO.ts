import User from "../entities/User";
import { DataSource, Like } from "typeorm";
import { stringify } from "querystring";
import Filter from "../util/Filter";

class UserDAO {
    private currentUser : User;

    constructor(currentUser : User){
        this.currentUser = currentUser;
    }

    async searchAll(filters: Filter = {}) : Promise<Array<User>> {
        filters.where = {};

        if (typeof filters.id === "string") {
            filters.where.id = filters.id;
        }

        if (typeof filters.name === "string") {
            filters.where.name = Like(`%${filters.name}%`);
        }

        if (typeof filters.email === "string") {
            filters.where.email = filters.email;
        }

        if (typeof filters.profileId === "string") {
            filters.where.profileId = filters.profileId;
        }

        if (typeof filters.isSentMail === "boolean") {
            filters.where.isSentMail = filters.isSentMail;
        }

        if (typeof filters.isConfirmed === "boolean") {
            filters.where.isConfirmed = filters.isConfirmed;
        }

        filters.where.isEnabled = true;
        return await User.getRepository().find(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<User>> {
        filters.where = {};

        if (typeof filters.id === "string") {
            filters.where.id = filters.id;
        }

        if (typeof filters.createdByUserId === "string") {
            filters.where.createdByUserId = filters.createdByUserId;
        }

        if (typeof filters.name === "string") {
            filters.where.name = Like(`%${filters.name}%`);
        }

        if (typeof filters.email === "string") {
            filters.where.email = filters.email;
        }

        if (typeof filters.birthDay === "string") {
            filters.where.birthDay = filters.birthDay;
        }

        filters.where.isEnabled = true;
        return await User.getRepository().find(filters);
    }
}

export default UserDAO;