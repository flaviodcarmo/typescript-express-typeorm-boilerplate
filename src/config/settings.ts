import dotenv from "dotenv";
dotenv.config();

export const settings : any = 
{
    PORT: process.env["PORT"],
    SECRET_KEY: process.env["SECRET_KEY"],
    DATABASE: {
        TYPE: process.env["TYPE"],
        HOST: process.env["HOST"],
        PORT: process.env["DATABASE_PORT"],
        USERNAME: process.env["USERNAME"],
        PASSWORD: process.env["PASSWORD"],
        NAME: process.env["DATABASE"]
    },
    MAIL: {
        FROM: '',
        USER: '',
        PASSWORD: ''
    },
    TESTS: {
        PORT: 3313,
        USERS: {
            ADMINISTRATOR:
            {
                EMAIL: '',
                PASSWORD: ''
            },
            USER: {
                EMAIL: '',
                PASSWORD: ''
            }
        }
    }
};