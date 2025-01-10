import User from "../../entities/User";
import { Request, Response } from 'express';
import AppUtil from "../../util/AppUtil";

class BaseController<BO> {
    bo : BO;
    _currentUser : User;
    req : Request;
    res : Response;
    private appUtil : AppUtil;

    constructor(req: Request, res: Response, bo : any) {
        this.req = req;
        this.res = res;
        this.appUtil = new AppUtil();

        this.getCurrentUser(bo);
    }

    async getCurrentUser(bo : any) {
        let headersUser: any = (this.req as any).currentUser;
        let currentUser : User = new User();
        
        if (typeof headersUser === "object") {
            currentUser.id = headersUser.userId;
            currentUser.profileId = headersUser.profileId;
        }

        this._currentUser = currentUser;
        this.bo = new bo(this._currentUser);
    }
}

export default BaseController;