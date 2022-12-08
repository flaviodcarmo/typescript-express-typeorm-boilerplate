import User from "../entities/User";
import ConfirmationType from "../entities/ConfirmationType";
import ConfirmationTypeDAO from "../daos/ConfirmationTypeDAO";
import { constants } from "../util/Constants";
import AppUtil from "../util/AppUtil";
import Result from "../util/Result";
import Filter from "../util/Filter";

class ConfirmationTypeBO {
    private currentUser : User;
    private dao : ConfirmationTypeDAO;
    private appUtil : AppUtil;
    
    constructor(currentUser : User){
        this.currentUser = currentUser;
        this.dao = new ConfirmationTypeDAO(currentUser);
        this.appUtil = new AppUtil();
    }

    async searchAll(filters: Filter = {}) : Promise<Array<ConfirmationType>> {
        return await this.dao.searchAll(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<ConfirmationType>> {

        if(this.currentUser.profileId !== constants.profile.ADMINISTRATOR_ID){
            filters.createdByUserId = this.currentUser.id;
        }

        return await this.dao.getByParameters(filters);
    }

    async save(confirmationType: ConfirmationType) : Promise<Result>{
        try {
            let r : Result = new Result();

            r = await this.validateSave(confirmationType);
            if(r.isError === true) {
                return r;
            }
            confirmationType = r.returnObject as ConfirmationType;

            if(confirmationType.id === undefined){
                confirmationType.id = await this.appUtil.getNewId();
                confirmationType.createdDate = new Date();
                confirmationType.createdByUserId = this.currentUser.id;
            } else {
                confirmationType.updatedByUserId = this.currentUser.id;
                confirmationType.updatedDate = new Date();
            }

            confirmationType = await confirmationType.save();

            return new Result().returnSuccess(confirmationType);
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao salvar o tipo de confirmação.', 500);
        }
    }

    async validateSave(confirmationType: ConfirmationType) : Promise<Result> {
        try {
            let errors : Array<string> = [];
            let currentCT : ConfirmationType | undefined;

            if(typeof confirmationType.id === "string" && confirmationType.id.trim() !== ""){
                currentCT = (await this.getByParameters({ id: confirmationType.id }))[0];
                if(currentCT === undefined){
                    errors.push('O id informado é inválido!');
                }
            }

            if(typeof confirmationType.name !== "string" || confirmationType.name.trim() === ""){
                errors.push('O nome é de preenchimento obrigatório!');
            } else {
                let rs = (await this.getByParameters({ name: confirmationType.name })).filter(c => c.id !== confirmationType.id)[0];
                if(rs !== undefined){
                    errors.push(`Já existe um registro cadastrado com o nome ${confirmationType.name}`);
                }
            }

            if(errors.length > 0) {
                return new Result().returnErrors(errors, 422);
            }

            return new Result().returnSuccess(confirmationType);
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro na validação de salvar o tipo de confirmação.');
        }
    }


    async delete(confirmationType: ConfirmationType) : Promise<Result>{
        try {
            let r : Result = new Result();

            r = await this.validateDelete(confirmationType);
            if(r.isError === true) {
                return r;
            }
            confirmationType = r.returnObject as ConfirmationType;

            confirmationType.deletedByUserId = this.currentUser.id;
            confirmationType.deletedDate = new Date();
            confirmationType.isEnabled = 0;

            confirmationType = await confirmationType.save();

            return new Result().returnSuccess({});
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao deletar o tipo de confirmação.', 500);
        }
    }

    async validateDelete(confirmationType: ConfirmationType) : Promise<Result> {
        try {
            let errors : Array<string> = [];
            let currentCT : ConfirmationType | undefined = undefined;

            if(typeof confirmationType.id !== "string" || confirmationType.id.trim() === ""){
                errors.push('O id é de preenchimento obrigatório!');
            } else {
                currentCT = (await this.getByParameters({ id: confirmationType.id }))[0];
                if(currentCT === undefined){
                    errors.push('O id informado é inválido!');
                }
            }

            if(errors.length > 0) {
                return new Result().returnErrors(errors, 422);
            }

            confirmationType = currentCT;

            return new Result().returnSuccess(confirmationType);
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro na validação de deletar o tipo de confirmação.');
        }
    }
}

export default ConfirmationTypeBO;