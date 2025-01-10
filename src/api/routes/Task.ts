import { Router } from 'express';
import TaskController from "../controllers/TaskController";
import { auth } from '../../middleware/Auth';
import BaseRouter from "./BaseRouter";
import { HttpMethod } from '../../util/HttpMethodUtil';

const router : Router = Router();
const baseRouter : BaseRouter = new BaseRouter(router);

baseRouter.request(HttpMethod.GET, '/api/1/tasks', [auth.requireAdministrator], TaskController, 'getByParameters');

export default router;