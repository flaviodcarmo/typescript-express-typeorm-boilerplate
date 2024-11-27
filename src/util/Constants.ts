import dotenv from "dotenv";
dotenv.config();

export const constants = {
    userAdministrator: {
        ID: process.env["DEFAULT_ADMINSTRATOR_USER_ID"] || '5a06ed47-798c-42ef-ad49-0e9bfa038b0c',
        NAME: process.env["DEFAULT_ADMINSTRATOR_USER_NAME"] || 'Admin',
        EMAIL: process.env["DEFAULT_ADMINSTRATOR_USER_EMAIL"] || 'admin@admin'
    },
    profile: {
        ADMINISTRATOR_ID:   process.env["DEFAULT_ADMINSTRATOR_PROFILE_ID"]  || '5a06ed47-798c-42ef-ad49-0e9bfa038b0c',
        USER_ID:            process.env["DEFAULT_USER_PROFILE_ID"] || '5a06ed47-798c-42ef-ad49-0e9bfa038b0c',
        USER_NAME:          process.env["DEFAULT_USER_PROFILE_NAME"]  || '5a06ed47-798c-42ef-ad49-0e9bfa038b0c'
    },
    confirmationType: {
        USER_REGISTRATION_SIGN_IN_ID:    process.env["DEFAULT_CONFIRMATION_TYPE_USER_ID"] || '5a06ed47-798c-42ef-ad49-0e9bfa038b0c',
        USER_REGISTRATION_SIGN_IN_NAME:  process.env["DEFAULT_CONFIRMATION_TYPE_USER_NAME"] || 'Confirmação de usuário'
    }
};