import { RATES } from "@/lib/andrjs/ados/rates";
import { LcdClient } from "@/lib/andrjs/lcd-client/client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, CacheEntry>({
    max: 5,
});

export const getRate = async (lcdUrl: string, ratesAddress: string, action: string) => {
    return cachified({
        key: ["query", "rates", "getRate", ratesAddress, action].join("-"),
        cache,
        ttl: 1000 * 60 * 5,      //5 minutes
        getFreshValue: async () => {
            const lcdClient = new LcdClient(lcdUrl);
            const rate = await lcdClient.queryContractSmart<RATES.GetRateResponse>(
                ratesAddress,
                RATES.getRate({ action }),
            )
            return rate;
        }
    })
}