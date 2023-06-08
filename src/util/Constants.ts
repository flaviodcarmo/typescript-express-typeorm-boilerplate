import dotenv from "dotenv";
dotenv.config();

export const constants = {
    userAdministrator: {
        ID: 'd740e608-44a3-11ed-8da5-0242ac140002',
        NAME: 'ADMINISTRADOR',
        EMAIL: 'administrator@administrator'
    },
    profile: {
        ADMINISTRATOR_ID:   'b8167e32-0f4a-11ed-9043-0242ac120002',
        USER_ID:            'f803e36e-3c56-11ed-a6d2-0242ac140002',
        USER_NAME:          'USER'
    },
    confirmationType: {
        USER_REGISTRATION_SIGN_IN_ID:    'c67edcc0-b112-42fe-b4dc-38941fdc9333',
        USER_REGISTRATION_SIGN_IN_NAME:  'User confirmation Sign in'
    }
};