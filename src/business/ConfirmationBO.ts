import User from "../entities/User";
import Confirmation from "../entities/Confirmation";
import ConfirmationDAO from "../daos/ConfirmationDAO";
import { constants } from "../util/Constants";
import Filter from "../util/Filter";

class ConfirmationBO {
    private currentUser : User;
    private dao : ConfirmationDAO;
    
    constructor(currentUser : User){
        this.currentUser = currentUser;
        this.dao = new ConfirmationDAO(currentUser);
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Confirmation>> {
        return await this.dao.searchAll(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Confirmation>> {
        if(this.currentUser.profileId !== constants.profile.ADMINISTRATOR_ID){
            filters.userId = this.currentUser.id;
        }

        return await this.dao.getByParameters(filters);
    }
}

export default ConfirmationBO;