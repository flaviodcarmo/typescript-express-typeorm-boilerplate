import { Router } from "express";
import bodyParser from 'body-parser';
import user from "./User";
import confirmationType from "./ConfirmationType";
import profile from "./Profile";

const routes : Router = Router();

routes.use(bodyParser.json());

const routeModules: Router[] = 
[
    user, 
    confirmationType, 
    profile
];

routeModules.forEach((route) => routes.use(route));

export default routes;