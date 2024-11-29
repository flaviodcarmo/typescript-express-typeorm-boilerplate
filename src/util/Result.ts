class Result {
    isError         : boolean = false;
    errorMessage    : string | null;
    errors          : Array<string> = [];
    returnObject    : any = {};
    message         : string;
    httpCode        : number = (this.isError === true ? 500 : 201);
    static success  : Result = Result.returnSuccess();
    static error    : Result = Result.returnError();

    static returnErrors(errors : Array<string>, httpCode : number | null = null) : Result {
        let r : Result      = new Result();

        r.isError           = true;
        r.errors            = errors;
        r.httpCode          = httpCode != null ? httpCode : r.httpCode;

        return r;
    }

    static returnError(error : string | null = null, httpCode : number | null = null) : Result {
        let r : Result      = new Result();

        r.isError           = true;
        r.errorMessage      = error;
        r.errors            = error === null ? [] : [error];
        r.httpCode          = httpCode != null ? httpCode : r.httpCode;

        return r;
    }

    static returnSuccess(object : any = null, httpCode : number | null = null) : Result {
        let r : Result      = new Result();

        r.isError           = false;
        r.returnObject      = object;

        return r;
    }
}

export default Result;