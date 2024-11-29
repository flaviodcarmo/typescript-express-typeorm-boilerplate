import User from "../entities/User";
import Profile from "../entities/Profile";
import Filter from "../util/Filter";

class ProfileDAO {
    private currentUser : User;

    constructor(currentUser : User){
        this.currentUser = currentUser;
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Profile>> {
        filters.where = {};

        if (typeof filters.id === "string") {
            filters.where.id = filters.id;
        }

        if (typeof filters.name === "string") {
            filters.where.name = filters.name;
        }

        if (typeof filters.createdByUserId === "string") {
            filters.where.createdByUserId = filters.createdByUserId;
        }

        filters.where.isEnabled = true;
        return await Profile.getRepository().find(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Profile>> {
        filters.where = {};

        if (typeof filters.id === "string") {
            filters.where.id = filters.id;
        }

        if (typeof filters.name === "string") {
            filters.where.name = filters.name;
        }

        if (typeof filters.createdByUserId === "string") {
            filters.where.createdByUserId = filters.createdByUserId;
        }

        filters.where.isEnabled = true;
        return await Profile.getRepository().find(filters);
    }
}

export default ProfileDAO;