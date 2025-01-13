import User from "../../entities/User";
import Task from "../../entities/Task";
import TaskBO from "../../business/TaskBO";
import TaskDAO from "../../daos/TaskDAO";
import { Request, Response } from 'express';
import Result from "../../util/Result";
import Filter from "../../util/Filter";
import BaseController from "./BaseController";

class TaskController extends BaseController<TaskBO> {
    private dao : TaskDAO;
    
    constructor(req : Request, res : Response) {
        super(req, res, TaskBO);
    }

    async searchAll(filters: Filter = {}) : Promise<Response> {
        try {
            let tasks : Array<Task>;
            let filters : Filter = {};
            let query : Filter = {};

            if (typeof query?.id === 'string') {
                filters.id = query.id;
            }
    
            if (typeof query?.name === 'string') {
                filters.name = query.name;
            }
    
            tasks = await this.bo.searchAll(filters);
            return this.res.status(200).json(tasks);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar as tarefas.']);
        }
    }

    async getByParameters(filters: Filter = {}) : Promise<Response> {
        try {
            let tasks : Array<Task>;
            let filters : Filter = {};
            let query : Filter = this.req.query;

            if (typeof query?.id === 'string') {
                filters.id = query.id;
            }
    
            if (typeof query?.name === 'string') {
                filters.name = query.name;
            }

            tasks = await this.bo.getByParameters(filters);
            return await this.res.status(200).json(tasks);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao buscar as tarefas.']);
        }
    }

    async save() : Promise<Response> {
        try {
            let r : Result = new Result();
            let task : Task = new Task();

            task.id = this.req?.params?.id;
            task.name = this.req.body.name;
            task.refDate = this.req.body.refDate;
            task.userId = this.req.body.userId;

            r = await this.bo.save(task);
            if (r.isError) {
                return this.res.status(r.httpCode).json(r.errors);
            }
            task = r.returnObject as Task;
                        
            return this.res.status(200).json(task);
        } catch(e) {
            console.error(e);
            return this.res.status(500).json(['Ocorreu um erro ao salvar a tarefa.']);
        }
    }
}

export default TaskController;