import { Router } from 'express';
import DollarController from '../controllers/DollarController';
import BaseRouter from "./BaseRouter";
import { HttpMethod } from '../../util/HttpMethodUtil';

const router : Router = Router();
const baseRouter : BaseRouter = new BaseRouter(router);

baseRouter.request(HttpMethod.GET, '/api/1/dollar', [], DollarController, 'getByParameters');

export default router;