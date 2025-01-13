import { Router } from 'express';
import TaskController from "../controllers/TaskController";
import { auth } from '../../middleware/Auth';
import BaseRouter from "./BaseRouter";
import { HttpMethod } from '../../util/HttpMethodUtil';

const router : Router = Router();
const baseRouter : BaseRouter = new BaseRouter(router);

baseRouter.request(HttpMethod.GET, '/api/1/tasks', [auth.requireLogin], TaskController, 'getByParameters');
baseRouter.request(HttpMethod.POST, '/api/1/tasks', [auth.requireLogin], TaskController, 'save');
baseRouter.request(HttpMethod.PUT, '/api/1/tasks/:id', [auth.requireLogin], TaskController, 'save');

export default router;