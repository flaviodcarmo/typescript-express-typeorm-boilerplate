import { Router } from 'express';
import ProfileController from "../controllers/ProfileController";
import { auth } from '../../middleware/Auth';
import BaseRouter from "./BaseRouter";
import { HttpMethod } from '../../util/HttpMethodUtil';

const router : Router = Router();
const baseRouter : BaseRouter = new BaseRouter(router);

baseRouter.request(HttpMethod.GET, '/api/1/profiles', [auth.requireAdministrator], ProfileController, 'getByParameters');
baseRouter.request(HttpMethod.GET, '/api/1/profiles/:id', [auth.requireAdministrator], ProfileController, 'getById');
baseRouter.request(HttpMethod.POST, '/api/1/profiles', [auth.requireAdministrator], ProfileController, 'insert');
baseRouter.request(HttpMethod.PUT, '/api/1/profiles/:id', [auth.requireAdministrator], ProfileController, 'update');
baseRouter.request(HttpMethod.DELETE, '/api/1/profiles/:id', [auth.requireAdministrator], ProfileController, 'delete');

export default router;