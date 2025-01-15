import User from "../entities/User";
import { constants } from "../util/Constants";
import Result from "../util/Result";
import { httpRequestUtil } from "../util/HttpRequestUtil";
import { settings } from "../config/settings";
import Dollar from "../entities/Dollar";

interface DollarAPIResponse {
    USDBRL: {
        code: string,
        codein: string,
        name: string,
        high: string,
        low: string,
        varBid: string,
        pctChange: string,
        bid: string,
        ask: string,
        timestamp: string,
        create_date: Date
    }
}

class DollarService {
    r: Result = new Result();
    currentUser: User;

    constructor() {
        let user: User = new User();
        user.id = constants.userAdministrator.ID;
        user.profileId = constants.profile.ADMINISTRATOR_ID;
        this.currentUser = user;
    }

    async saveDollarExchangeRate(): Promise<Result> {
        try {
            let dollar: Dollar;

            let endpoint = `${settings.API_DOLLAR.URL}/USD-BRL`;
            let headers = {
                'Accept': 'application/json'
            };

            const resp = await httpRequestUtil.get(endpoint, headers);
            if (resp.isError) {
                console.error(resp.errorMessage);
                return resp;
            }

            const objectResponse: DollarAPIResponse = resp.returnObject;
            const { code, codein, high, low, varBid, pctChange, bid, ask, create_date } = objectResponse.USDBRL;

            dollar = new Dollar();
            dollar.askPrice = ask;
            dollar.bidPrice = bid;
            dollar.bidVariation = varBid;
            dollar.fromCode = code;
            dollar.toCode = codein;
            dollar.high = high;
            dollar.low = low;
            dollar.percentageChange = pctChange;
            dollar.refDate = create_date;

            dollar.createdByUserId = this.currentUser.id;
            dollar.isEnabled = true;

            dollar = await dollar.save();

            console.info('Cotação do dólar salva com sucesso! - ' + new Date());
            return Result.returnSuccess();
        } catch (e) {
            return Result.returnError((e as Error).message);
        }
    }
}


export default DollarService;

