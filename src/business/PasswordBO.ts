import User from "../entities/User";
import Password from "../entities/Password";
import PasswordDAO from "../daos/PasswordDAO";
import Filter from "../util/Filter";

class PasswordBO {
    private currentUser : User;
    private dao : PasswordDAO;
    
    constructor(currentUser : User){
        this.currentUser = currentUser;
        this.dao = new PasswordDAO(currentUser);
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Password>> {
        return await this.dao.searchAll(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Password>> {
        return await this.dao.getByParameters(filters);
    }
}

export default PasswordBO;