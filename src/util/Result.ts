import { ReturningStatementNotSupportedError } from "typeorm";

class Result {
    isError         : boolean = false;
    errorMessage    : string;
    errors          : Array<string> = [];
    returnObject    : any = {};
    message         : string;
    httpCode        : number = (this.isError === true ? 500 : 201);

    async returnErrors(errors : Array<string>, httpCode : number = null) : Promise<Result> {
        let r : Result      = new Result();
        r.isError           = true;
        r.errors            = errors;
        r.httpCode          = httpCode != null ? httpCode : r.httpCode;
        return r;
    }

    async returnError(error : string, httpCode : number = null) : Promise<Result> {
        let r : Result      = new Result();
        r.isError           = true;
        r.errorMessage      = error;
        r.errors            = [error];
        r.httpCode          = httpCode != null ? httpCode : r.httpCode;

        console.error(error);
        return r;
    }

    async returnSuccess(object : any = null, httpCode : number = null) : Promise<Result> {
        let r : Result      = new Result();
        r.isError           = false;
        r.returnObject      = object;
        this.returnObject   = object;
        return r;
    }
}

export default Result;