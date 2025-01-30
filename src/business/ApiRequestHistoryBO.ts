import { Request, Response } from 'express';
import AppUtil from "../util/AppUtil";
import ApiRequestHistory from "../entities/ApiRequestHistory";
import { lockManager } from "../util/LockManager";

class ApiRequestHistoryBO {
    private appUtil : AppUtil;

    constructor() {
        this.appUtil = new AppUtil();
    }

    async generateApiHistory(req : Request, res : Response) : Promise<void> {
        const release = await lockManager.acquire("ApiRequestHistoryBO.generateApiHistory");

        try {
            let aph : ApiRequestHistory = new ApiRequestHistory();
            let body : any;
            let json : any;

            aph.id = await this.appUtil.getNewId();

            try {
                aph.userId = (req as any)?.currentUser?.userId || null;
            } catch {}

            try {
                aph.userToken = req?.header('Authorization')?.replace('Bearer ', '') || null;
            } catch {}

            try {
                aph.url = req?.url || null;
            } catch {}

            try {
                aph.method = req?.method || null;
            } catch {}

            try {
                body = Object.assign({}, req?.body);

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
                json = Object.assign({}, res?.json);

                if (typeof json?.password === 'string') {
                    json.password = "******";
                }

                if (typeof json?.confirmPassword === 'string') {
                    json.confirmPassword = "******";
                }

                aph.json = JSON.stringify(json) || null;
            } catch (e) {
                console.error((e as Error).message)
            }

            try {
                aph.httpCode = res?.statusCode || null;
            } catch {}

            try {
                aph.ip = req?.socket?.remoteAddress || null;
            } catch {}

            try {
                aph.sourceApp = req?.header('user-agent') || null;
            } catch {}

            aph.createdDate = new Date();

            aph = await aph.save();
        } catch(e) {
            console.error((e as Error).message);
        } finally {
            release();
        }
    }
}

export default ApiRequestHistoryBO;