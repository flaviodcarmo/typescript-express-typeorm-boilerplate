import User from "../entities/User";
import Task from "../entities/Task";
import TaskDAO from "../daos/TaskDAO";
import { constants } from "../util/Constants";
import Filter from "../util/Filter";
import Result from "../util/Result";
import AppUtil from "../util/AppUtil";
import UserBO from "../business/UserBO";

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
            filters.userId = this.currentUser.id;
        }

        return await this.dao.getByParameters(filters);
    }

    async save(task : Task) : Promise<Result> {
        try {
            let r : Result;

            r = await this.validateSave(task);
            if (r.isError) {
                return r;
            }
            task = r.returnObject as Task;

            if (task.id === undefined) {
                task.createdByUserId = this.currentUser.id;
                task.createdDate = new Date();

                task.id = await this.appUtil.getNewId();
            } else {
                task.updatedByUserId = this.currentUser.id;
                task.updatedDate = new Date();
            }

            task = await Task.save(task);

            return Result.returnSuccess(task);
        } catch(e) {
            return Result.error;
        }
    }

    async validateSave(task : Task) : Promise<Result> {
        try {
            let errors : Array<string> = [];
            let currentTask : Task | undefined = undefined;
            let userTask : User | undefined = undefined;

            let userBO : UserBO = new UserBO(this.currentUser);

            if (task.id !== undefined) {
                currentTask = (await this.getByParameters({ id: task.id }))[0];
                if (currentTask === undefined) {
                    return Result.returnError('A tarefa não foi encontrada.', 404);
                }
            }

            if (typeof task.userId === "string" && task.userId.trim() !== "") {
                userTask = (await userBO.getByParameters({ id: task.userId }))[0];
                if (userTask === undefined) {
                    return Result.returnError('O usuário não foi encontrado.', 404);
                }
            } else {
                task.userId = this.currentUser.id;
            }

            if (typeof task.name !== "string" || task.name.trim() === "") {
                errors.push('O nome é de preenchimento obrigatório!');
            }

            if (typeof task.refDate !== "string" || task.refDate.trim() === "") {
                errors.push('A data é de preenchimento obrigatório!');
            } else if (this.appUtil.validateDate(task.refDate) === false) {
                errors.push('A data informada é inválida!');
            }
            
            if (errors.length > 0) {
                return Result.returnErrors(errors);
            }

            if (currentTask !== undefined) {
                currentTask.name = task.name;
                currentTask.refDate = task.refDate;
                currentTask.userId = task.userId;

                task = currentTask;
            }

            return Result.returnSuccess(task);
        } catch(e) {
            return Result.error;
        }
    }
}

export default TaskBO;