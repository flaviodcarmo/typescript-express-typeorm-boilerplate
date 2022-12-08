import { Router } from "express";
import user from "./User";
import confirmationType from "./ConfirmationType";
import profile from "./Profile";
import bodyParser from 'body-parser';

const routes = Router();

routes.use(user);
routes.use(confirmationType);
routes.use(profile);

routes.use(bodyParser.json());

export default routes;