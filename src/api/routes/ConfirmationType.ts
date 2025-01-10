import { Router } from 'express';
import ConfirmationTypeController from "../controllers/ConfirmationTypeController";
import { auth } from '../../middleware/Auth';
import { HttpMethod } from '../../util/HttpMethodUtil';
import BaseRouter from "./BaseRouter";

const router : Router = Router();
const baseRouter : BaseRouter = new BaseRouter(router);

baseRouter.request(HttpMethod.GET, '/api/1/confirmation-types', [auth.requireAdministrator], ConfirmationTypeController, 'getByParameters');
baseRouter.request(HttpMethod.GET, '/api/1/confirmation-types/:id', [auth.requireAdministrator], ConfirmationTypeController, 'getById');
baseRouter.request(HttpMethod.POST, '/api/1/confirmation-types', [auth.requireAdministrator], ConfirmationTypeController, 'insert');
baseRouter.request(HttpMethod.PUT, '/api/1/confirmation-types/:id', [auth.requireAdministrator], ConfirmationTypeController, 'update');
baseRouter.request(HttpMethod.DELETE, '/api/1/confirmation-types/:id', [auth.requireAdministrator], ConfirmationTypeController, 'delete');

export default router;