import { v4 as uuidv4 } from 'uuid';

class AppUtil {

    async getNewId() : Promise<string> {
        return uuidv4();
    }

    async generateConfirmationCode() : Promise<string> {
        let min : number = Math.ceil(100000);
        let max : number = Math.floor(999999);
        let code : number = Math.floor(Math.random() * (max - min + 1) + min);

        return code.toString();
    }

    async sleep(milliseconds : number) {
        const sleep = require('util').promisify(setTimeout)
        return sleep(milliseconds);
    }
}

export default AppUtil;