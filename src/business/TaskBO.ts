import User from "../entities/User";
import Task from "../entities/Task";
import TaskDAO from "../daos/TaskDAO";
import { constants } from "../util/Constants";
import Filter from "../util/Filter";

class TaskBO {
    private currentUser : User;
    private dao : TaskDAO;
    
    constructor(currentUser : User) {
        this.currentUser = currentUser;
        this.dao = new TaskDAO();
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Task>> {
        return await this.dao.searchAll(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Task>> {
        if (this.currentUser.profileId !== constants.profile.ADMINISTRATOR_ID) {
            filters.createdByUserId = this.currentUser.id;
        }

        return await this.dao.getByParameters(filters);
    }
}

export default TaskBO;