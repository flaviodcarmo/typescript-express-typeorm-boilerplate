import { dbConnection } from "./config/dbConnection";
import app  from './app';
import { settings }  from './config/settings';

import UserService from "./services/UserService";

async function initialize() {
    try {
        await dbConnection.initialize();

        console.log("Data Source has been initialized!");

        app.listen(settings.PORT, async () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${settings.PORT}`);
        });

        setInterval(function() {
            new UserService().sendMailToConfirmation();
        }, 20000);
    } catch (error) {
        
    }
}

initialize();