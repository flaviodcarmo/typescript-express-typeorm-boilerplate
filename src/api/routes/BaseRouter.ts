import { Request, Response, Router, Handler, NextFunction } from 'express';
import ApiRequestHistoryBO from "../../business/ApiRequestHistoryBO";
import { HttpMethod } from '../../util/HttpMethodUtil';

class BaseRouter {
    private router: Router;
    
    constructor(router : Router) {
        this.router = router;
    }

    request(verb: HttpMethod, path : string, middlewares: Handler[], controller: any, method : string) : void {
        const apiRequestHistoryBO : ApiRequestHistoryBO = new ApiRequestHistoryBO();
        let responseBody : any = {};
        let customResponse : Response;

        this.router[verb](path, ...middlewares, async (req: Request, res: Response, next: NextFunction) => {
            const originalJson = res.json;

            res.json = (body: any) => {
                responseBody = body;
                return originalJson.call(res, body);
            };

            try {
                const controllerInstance = new controller(req, res);

                res = await controllerInstance[method]();
                
                try {
                    customResponse = Object.assign(Response, res);
                    customResponse.json = responseBody;
                } catch {}
            } catch (error) {
                next(error);
            } finally {
                apiRequestHistoryBO.generateApiHistory(req, customResponse);
            }
        });
    }
}

export default BaseRouter;