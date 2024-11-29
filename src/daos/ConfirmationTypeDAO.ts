import User from "../entities/User";
import ConfirmationType from "../entities/ConfirmationType";
import Filter from "../util/Filter";

class ConfirmationTypeDAO {
    private currentUser : User;

    constructor(currentUser : User){
        this.currentUser = currentUser;
    }

    async searchAll(filters: Filter = {}) : Promise<Array<ConfirmationType>> {
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
        return await ConfirmationType.getRepository().find(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<ConfirmationType>> {
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
        return await ConfirmationType.getRepository().find(filters);
    }
}

export default ConfirmationTypeDAO;