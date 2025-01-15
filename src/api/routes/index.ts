import { Router } from "express";
import user from "./User";
import confirmationType from "./ConfirmationType";
import profile from "./Profile";
import task from "./Task";
import dollar from "./Dollar";

const routes : Router = Router();

const routeModules: Router[] = 
[
    user, 
    confirmationType, 
    profile,
    task,
    dollar
];

routeModules.forEach((route) => routes.use(route));

export default routes;