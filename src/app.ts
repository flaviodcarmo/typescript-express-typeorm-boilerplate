import express, { Express } from 'express';
import { dbConnection } from "./config/dbConnection";
import dotenv from 'dotenv';
import routes from "./api/routes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(routes);

export default app;