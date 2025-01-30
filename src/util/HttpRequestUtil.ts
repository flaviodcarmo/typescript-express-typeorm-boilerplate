import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Result from "./Result";

export const httpRequestUtil = 
{
    get: async (url: string, headers: any = null) : Promise<Result> => {
        try {
            const config: AxiosRequestConfig = {
                headers: headers
            };
            const response: AxiosResponse = await axios.get(url, config);

            return Result.returnSuccess(response.data);
        } catch(e) {
            return Result.returnError((e as Error).message);
        }
    },

    post: async (url: string, headers: any, body: any) : Promise<Result> => {
        try {
            const config: AxiosRequestConfig = {
                headers: headers
            };
            const response: AxiosResponse = await axios.post(url, body, config);

            return Result.returnSuccess(response.data);
        } catch(e) {
            return Result.returnError((e as Error).message);
        }
    },
}

export default httpRequestUtil;