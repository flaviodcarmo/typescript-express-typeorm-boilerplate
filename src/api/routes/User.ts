import { Router } from 'express';
import UserController from "../controllers/UserController";
import { auth } from '../../middleware/Auth';
import BaseRouter from "./BaseRouter";
import { HttpMethod } from '../../util/HttpMethodUtil';

const router : Router = Router();
const baseRouter : BaseRouter = new BaseRouter(router);

baseRouter.request(HttpMethod.GET, '/api/1/users', [auth.requireLogin], UserController, 'getByParameters');
baseRouter.request(HttpMethod.GET, '/api/1/users/:id', [auth.requireLogin], UserController, 'getById');
baseRouter.request(HttpMethod.POST, '/api/1/users', [], UserController, 'signup');
baseRouter.request(HttpMethod.POST, '/api/1/users/:id/confirm', [], UserController, 'confirm');
baseRouter.request(HttpMethod.POST, '/api/1/users/auth', [], UserController, 'auth');

export default router;