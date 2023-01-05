import dotenv from "dotenv";

dotenv.config();

export const settings : any = 
{
    PORT: 3456,
    SECRET_KEY: '',
    DATABASE: {
        TYPE: '',
        HOST: '',
        PORT: 3312,
        USERNAME: '',
        PASSWORD: '',
        NAME: ''
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