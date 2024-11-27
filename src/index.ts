import { dbConnection } from "./config/dbConnection";
import app  from './app';
import { settings }  from './config/settings';

import UserService from "./services/UserService";
import DefaultService from "./services/DefaultService";
import Result from "./util/Result";

async function initialize() {
    let r : Result = new Result();

    try {
        await dbConnection.initialize();

        console.log("Data Source has been initialized!");

        app.listen(settings.PORT, async () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${settings.PORT}`);
        });

        setInterval(async function() {
            //await new UserService().sendMailToConfirmation();
        }, 20000);

        //new DefaultService().createDefaultData();
    } catch (error) {
        console.error(error)
    }
}

initialize();