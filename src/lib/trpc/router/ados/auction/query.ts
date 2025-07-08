import { AUCTION } from "@/lib/andrjs/ados/auction";
import { LcdClient } from "@/lib/andrjs/lcd-client/client";
import cachified, { CacheEntry } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";


const cache = new LRUCache<string, CacheEntry>({
    max: 5,
});


export async function queryAuctionLatestSaleState(lcdUrl: string, contractAddress: string, tokenAddress: string, token_id: string) {
    return cachified({
        key: ["query", "auction", "getLatestSaleState", contractAddress, tokenAddress, token_id].join("-"),
        cache,
        ttl: 1000 * 60 * 5, // 5 minutes
        getFreshValue: async () => {
            const lcdClient = new LcdClient(lcdUrl);
            const tokenInfo =
                await lcdClient.queryContractSmart<AUCTION.GetLatestSaleStatePesponse>(
                    contractAddress,
                    AUCTION.getLatestSaleState(tokenAddress, token_id)

                );
            return tokenInfo;
        },
    });
}




export async function queryBids(lcdUrl: string, contractAddress: string, auction_id: string, pagination?: AUCTION.GetBidsPagination) {
    pagination = AUCTION.createGetBidsPagination(pagination)
    return cachified({
        key: ["query", "auction", "getBids", contractAddress, auction_id, pagination.limit, pagination.start_after].join("-"),
        cache,
        ttl: 1000 * 60 * 5, // 5 minutes
        getFreshValue: async () => {
            const lcdClient = new LcdClient(lcdUrl);
            const bidsInfo =
                await lcdClient.queryContractSmart<AUCTION.GetBidsResponse>(
                    contractAddress,
                    AUCTION.getBids(auction_id, pagination)
                );
            return bidsInfo;
        },
    });
}
