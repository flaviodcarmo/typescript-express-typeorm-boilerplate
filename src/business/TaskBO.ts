import User from "../entities/User";
import Task from "../entities/Task";
import TaskDAO from "../daos/TaskDAO";
import { constants } from "../util/Constants";
import Filter from "../util/Filter";
import Result from "../util/Result";
import AppUtil from "../util/AppUtil";

class TaskBO {
    private currentUser : User;
    private dao : TaskDAO;
    private appUtil : AppUtil;
    
    constructor(currentUser : User) {
        this.currentUser = currentUser;
        this.dao = new TaskDAO();
        this.appUtil = new AppUtil();
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

    async save(task : Task) : Promise<Result> {
        try {
            let r : Result;

            r = await this.validateSave(task);
            if (r.isError){
                return r;
            }

            task.createdByUserId = this.currentUser.id;
            task.userId = this.currentUser.id;
            task.id = await this.appUtil.getNewId();

            task = await Task.save(task);

            return Result.returnSuccess(task);
        } catch(e) {
            return Result.error;
        }
    }

    async validateSave(task : Task) : Promise<Result> {
        try {

            return Result.success;
        } catch(e) {
            return Result.error;
        }
    }
}

export default TaskBO;