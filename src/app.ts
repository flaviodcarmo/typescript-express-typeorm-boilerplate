import express, { Express } from 'express';
import { dbConnection } from "./config/dbConnection";
import dotenv from 'dotenv';
import routes from "./api/routes";
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(routes);

export default app;