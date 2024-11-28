import dotenv from "dotenv";

dotenv.config();

export const constants = {
    userAdministrator: {
        ID : process.env["DEFAULT_ADMINSTRATOR_USER_ID"] || '',
        NAME: process.env["DEFAULT_ADMINSTRATOR_USER_NAME"] || '',
        EMAIL: process.env["DEFAULT_ADMINSTRATOR_USER_EMAIL"] || ''
    },
    profile: {
        ADMINISTRATOR_ID:   process.env["DEFAULT_ADMINSTRATOR_PROFILE_ID"] || '',
        USER_ID:            process.env["DEFAULT_USER_PROFILE_ID"] || '',
        USER_NAME:          process.env["DEFAULT_USER_PROFILE_NAME"]  || ''
    },
    confirmationType: {
        USER_REGISTRATION_SIGN_IN_ID:    process.env["DEFAULT_CONFIRMATION_TYPE_USER_ID"] || '',
        USER_REGISTRATION_SIGN_IN_NAME:  process.env["DEFAULT_CONFIRMATION_TYPE_USER_NAME"] || ''
    }
};