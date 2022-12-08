import User from "../entities/User";
import Profile from "../entities/Profile";
import ProfileDAO from "../daos/ProfileDAO";
import { constants } from "../util/Constants";
import AppUtil from "../util/AppUtil";
import Result from "../util/Result";
import Filter from "../util/Filter";

class ProfileBO {
    private currentUser : User;
    private dao : ProfileDAO;
    private appUtil : AppUtil;
    
    constructor(currentUser : User){
        this.currentUser = currentUser;
        this.dao = new ProfileDAO(currentUser);
        this.appUtil = new AppUtil();
    }

    async searchAll(filters: Filter = {}) : Promise<Array<Profile>> {
        return await this.dao.searchAll(filters);
    }

    async getByParameters(filters: Filter = {}) : Promise<Array<Profile>> {
        if(this.currentUser.profileId !== constants.profile.ADMINISTRATOR_ID){
            filters.createdByUserId = this.currentUser.id;
        }

        return await this.dao.getByParameters(filters);
    }

    async save(profile: Profile) : Promise<Result> {
        try {
            let r : Result = new Result();

            r = await this.validateSave(profile);
            if(r.isError === true) {
                return r;
            }
            profile = r.returnObject as Profile;

            console.log(profile)

            if(profile.id === undefined){
                profile.id = await this.appUtil.getNewId();
                profile.createdDate = new Date();
                profile.createdByUserId = this.currentUser.id;
            } else {
                profile.updatedByUserId = this.currentUser.id;
                profile.updatedDate = new Date();
            }

            profile = await profile.save();

            return new Result().returnSuccess(profile);
        } catch (e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao salvar o perfil.');
        }
    }

    async validateSave(profile: Profile) : Promise<Result> {
        try {
            let errors : Array<string> = [];
            let currentProfile : Profile | undefined;

            if(typeof profile.id === "string" && profile.id.trim() !== ""){
                currentProfile = (await this.getByParameters({ id: profile.id }))[0];
                if(currentProfile === undefined){
                    errors.push('O id informado é inválido!');
                }
            }

            if(typeof profile.name !== "string" || profile.name.trim() === ""){
                errors.push('O nome é de preenchimento obrigatório!');
            } else {
                if((await this.getByParameters({ name: profile.name })).filter(c => c.id !== profile.id)[0] !== undefined){
                    errors.push(`Já existe um registro cadastrado com o nome ${profile.name}`);
                }
            }

            if(errors.length > 0) {
                return new Result().returnErrors(errors, 422);
            }

            return new Result().returnSuccess(profile);
        } catch (e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao validar o perfil');
        }
    }

    async delete(profile: Profile) : Promise<Result>{
        try {
            let r : Result = new Result();

            r = await this.validateDelete(profile);
            if(r.isError === true) {
                return r;
            }
            profile = r.returnObject as Profile;

            profile.deletedByUserId = this.currentUser.id;
            profile.deletedDate = new Date();
            profile.isEnabled = 0;

            profile = await profile.save();

            return new Result().returnSuccess({});
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro ao deletar o perfil.', 500);
        }
    }

    async validateDelete(profile: Profile) : Promise<Result> {
        try {
            let errors : Array<string> = [];
            let currentProfile : Profile | undefined = undefined;

            if(typeof profile.id !== "string" || profile.id.trim() === ""){
                errors.push('O id é de preenchimento obrigatório!');
            } else {
                currentProfile = (await this.getByParameters({ id: profile.id }))[0];
                if(currentProfile === undefined){
                    errors.push('O id informado é inválido!');
                }
            }

            if(errors.length > 0) {
                return new Result().returnErrors(errors, 422);
            }

            profile = currentProfile;

            return new Result().returnSuccess(profile);
        } catch(e) {
            console.error(e);
            return new Result().returnError('Ocorreu um erro na validação de deletar o perfil.');
        }
    }
}

export default ProfileBO;