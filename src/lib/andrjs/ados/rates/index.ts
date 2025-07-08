import { RatesContractTsQueryMsgBuilder } from "./RatesContractTs.message-builder";
import { Rate } from "./RatesContractTs.types";

export namespace RATES {

    export const getRate = RatesContractTsQueryMsgBuilder.rate;
    export type GetRateResponse = Rate

}