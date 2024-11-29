import User from "../../entities/User";
import { Request, Response } from 'express';
import { Lock } from "async-await-mutex-lock";
import AppUtil from "../../util/AppUtil";

import ApiRequestHistory from "../../entities/ApiRequestHistory";
import console from "console";

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
        this.generateApiHistory();
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

    async generateApiHistory() {
        let lock = new Lock<string>();

        await lock.acquire("generateApiHistory");

        try {
            let aph : ApiRequestHistory = new ApiRequestHistory();
            let body : any;

            aph.id = await this.appUtil.getNewId();

            try {
                aph.userId = (this.req as any)?.currentUser?.userId || null;
            } catch {}

            try {
                aph.userToken = this.req?.header('Authorization')?.replace('Bearer ', '') || null;
            } catch {}

            try {
                aph.url = this.req?.url || null;
            } catch {}

            try {
                aph.method = this.req?.method || null;
            } catch {}

            try {
                body = Object.assign({}, this.req?.body);

                if (typeof body?.password === 'string') {
                    body.password = "******";
                }

                if (typeof body?.confirmPassword === 'string') {
                    body.confirmPassword = "******";
                }

                aph.body = JSON.stringify(body) || null;
            } catch (e) {
                console.error((e as Error).message)
            }

            try {
                aph.ip = this.req?.socket?.remoteAddress || null;
            } catch {}

            try {
                aph.sourceApp = this.req?.header('user-agent') || null;
            } catch {}

            aph.createdDate = new Date();

            aph = await aph.save();
        } catch(e) {
            console.error((e as Error).message);
        } finally {
            lock.release("generateApiHistory");
        }
    }
}

export default BaseController;