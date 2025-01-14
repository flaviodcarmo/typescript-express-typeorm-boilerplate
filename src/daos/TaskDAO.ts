import User from "../entities/User";
import Task from "../entities/Task";
import Filter from "../util/Filter";

class TaskDAO {
    private currentUser : User;

    constructor(currentUser : User){
        this.currentUser = currentUser;
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Task>> {
        filters.where = {};

        if (typeof filters.id === "string") {
            filters.where.id = filters.id;
        }

        if (typeof filters.name === "string") {
            filters.where.name = filters.name;
        }

        if (typeof filters.userId === "string") {
            filters.where.userId = filters.userId;
        }

        if (typeof filters.createdByUserId === "string") {
            filters.where.createdByUserId = filters.createdByUserId;
        }

        filters.where.isEnabled = true;
        return await Task.getRepository().find(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Task>> {
        filters.where = {};

        if (typeof filters.id === "string") {
            filters.where.id = filters.id;
        }
        
        if (typeof filters.name === "string") {
            filters.where.name = filters.name;
        }

        if (typeof filters.userId === "string") {
            filters.where.userId = filters.userId;
        }

        if (typeof filters.createdByUserId === "string") {
            filters.where.createdByUserId = filters.createdByUserId;
        }

        filters.where.isEnabled = true;
        return await Task.getRepository().find(filters);
    }
}

export default TaskDAO;