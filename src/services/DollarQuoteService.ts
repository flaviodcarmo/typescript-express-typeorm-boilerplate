import User from "../entities/User";
import Result from "../util/Result";
import { constants } from "../util/Constants";
import DollarQuote from "../entities/DollarQuote";
import { settings } from "../config/settings";
import httpRequestUtil from "../util/HttpRequestUtil";

class DollarQuoteService {
  currentUser : User;

  constructor() {
    let user: User = new User();
    user.id = constants.userAdministrator.ID;
    user.profileId = constants.profile.ADMINISTRATOR_ID;
    this.currentUser = user;
}

  async getDollarQuote () : Promise<Result> {
    let r: Result = new Result();
    let dollarQuote : DollarQuote;

    const url =  settings.URL_API_DOLLAR_QUOTE;
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }

    const response = await httpRequestUtil.get(url, headers);

    if (response.isError) {
      return response;
    }

    const responseObj = response.returnObject;
    const { code, codein, name, high, low, varBid, pctChange, bid, ask, create_date} = responseObj["USDBRL"];
    let newDollarQuote = new DollarQuote();

    newDollarQuote.code = code;
    newDollarQuote.codein = codein;
    newDollarQuote.name = name;
    newDollarQuote.high = high;
    newDollarQuote.low = low;
    newDollarQuote.varBid = varBid;
    newDollarQuote.pctChange = pctChange;
    newDollarQuote.bid = bid;
    newDollarQuote.ask = ask;
    newDollarQuote.createDate = create_date;
    newDollarQuote.createdByUserId = this.currentUser.id;
    newDollarQuote.isEnabled = true;

    await newDollarQuote.save();

    return Result.success;
  }

}

export default DollarQuoteService;