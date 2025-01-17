import { dbConnection } from "./config/dbConnection";
import app  from './app';
import { settings }  from './config/settings';

import UserService from "./services/UserService";
import DefaultService from "./services/DefaultService";
import Result from "./util/Result";
import DollarQuoteService from "./services/DollarQuoteService";

async function initialize() {
    let r : Result = new Result();

    try {
        await dbConnection.initialize();

        console.log("Data Source has been initialized!");

        app.listen(settings.PORT, async () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${settings.PORT}`);
        });

        setInterval(async function() {
            await new UserService().sendMailToConfirmation();
        }, 20000);

        new DefaultService().createDefaultData();
    
        setInterval(async function() {
            try {
                await new DollarQuoteService().getDollarQuote();
                // console.log(res); 
            } catch (error) {
                console.error('Erro ao obter a cotação do dólar:', error);
            }
        }, 60000);
         
    } catch (error) {
        console.error(error)
    }
}

initialize();
