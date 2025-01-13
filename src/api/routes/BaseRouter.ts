import { Request, Response, Router, Handler, NextFunction } from 'express';
import ApiRequestHistoryBO from "../../business/ApiRequestHistoryBO";
import { HttpMethod } from '../../util/HttpMethodUtil';
import Result from '../../util/Result';

class BaseRouter {
    private router: Router;
    
    constructor(router : Router) {
        this.router = router;
    }

    request(verb: HttpMethod, path : string, middlewares: any[], controller: any, method : string) : void {
        const apiRequestHistoryBO : ApiRequestHistoryBO = new ApiRequestHistoryBO();
        let responseBody : any = {};
        let customResponse : Response;

        let r : Result;

        this.router[verb](path, [], async (req: Request, res: Response, next: NextFunction) => {
            const originalJson = res.json;

            res.json = (body: any) => {
                responseBody = body;
                return originalJson.call(res, body);
            };

            try {
                for (const middleware of middlewares) {
                    r = await middleware(req, res, next);
                    if (r.isError === true) {
                        res.status(r.httpCode).json(r.errors);
                        throw new Error(r.message);
                    }
                }
                
                const controllerInstance = new controller(req, res);

                res = await controllerInstance[method]();
            } catch (error) {
                next(error);
            } finally {
                try {
                    customResponse = Object.assign(Response, res);
                    customResponse.json = responseBody;
                } catch {}

                apiRequestHistoryBO.generateApiHistory(req, customResponse);
            }
        });
    }
}

export default BaseRouter;