import { DataSource } from "typeorm";
import { settings }  from './settings';
import dotenv from "dotenv";

dotenv.config();

export const dbConnection = new DataSource({
    type: settings.DATABASE.TYPE,
    host: settings.DATABASE.HOST,
    port: settings.DATABASE.PORT,
    username: settings.DATABASE.USERNAME,
    password: settings.DATABASE.PASSWORD,
    database: settings.DATABASE.NAME,
    entities: [
        "src/entities/**/*.ts"
    ],
    logging: false,
    synchronize: false
});