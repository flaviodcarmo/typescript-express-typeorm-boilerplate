import User from "../entities/User";
import Dollar from "../entities/Dollar";
import DollarDAO from "../daos/DollarDAO";
import Filter from "../util/Filter";

class DollarBO {
    private currentUser : User;
    private dao : DollarDAO;
    
    constructor(currentUser : User) {
        this.currentUser = currentUser;
        this.dao = new DollarDAO();
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Dollar>> {
        return await this.dao.searchAll(filters);
    }
}

export default DollarBO;