import User from "../../entities/User";
import Task from "../../entities/Task";
import TaskBO from "../../business/TaskBO";
import TaskDAO from "../../daos/TaskDAO";
import { Request, Response } from 'express';
import Result from "../../util/Result";
import Filter from "../../util/Filter";
import BaseController from "./BaseController";

class TaskController extends BaseController<TaskBO> {
    private currentUser : User;
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
}

export default TaskController;