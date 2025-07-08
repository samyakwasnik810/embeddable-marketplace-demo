import { MARKETPLACE } from "@/lib/andrjs/ados/marketplace";
import { LcdClient } from "@/lib/andrjs/lcd-client/client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";


const cache = new LRUCache<string, CacheEntry>({
    max: 5,
});


export async function queryMarketplaceLatestSaleState(lcdUrl: string, contractAddress: string, tokenAddress: string, tokenId: string) {
    return cachified({
        key: ["query", "marketplace", "getLatestSaleState", contractAddress, tokenAddress, tokenId].join("-"),
        cache,
        ttl: 1000 * 60 * 5, // 5 minutes
        getFreshValue: async () => {
            const lcdClient = new LcdClient(lcdUrl);
            const latestSaleState =
                await lcdClient.queryContractSmart<MARKETPLACE.LatestSaleStateResponse>(
                    contractAddress,
                    MARKETPLACE.latestSaleStateMsg(tokenAddress, tokenId)

                );
            return latestSaleState;
        },
    });
}


