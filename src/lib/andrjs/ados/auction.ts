import { Uint128 } from "./types";

export namespace AUCTION {

    export const getLatestSaleState = (tokenAddress: string, tokenId: string) => {
        return {
            latest_auction_state: {
                token_id: tokenId,
                token_address: tokenAddress
            }

        };
    };

    export type GetLatestSaleStatePesponse = {
        start_time: { at_time: string },
        end_time: { at_time: string },
        high_bidder_addr: string,
        high_bidder_amount: Uint128,
        auction_id: Uint128,
        coin_denom: string,
        uses_cw20: boolean,
        whitelist: string[],
        min_bid: Uint128,
        min_raise: Uint128,
        owner: string,
        recipient: string,
        is_cancelled: boolean,
    };

    export interface GetBidsPagination {
        start_after?: number,
        limit: number
    }

    export function createGetBidsPagination(partial?: Partial<GetBidsPagination>): GetBidsPagination {
        return {
            start_after: partial?.start_after,
            limit: partial?.limit ?? 25
        }
    }

    export const getBids = (auctionId: string, pagination: GetBidsPagination) => {
        return {
            bids: {
                auction_id: auctionId,
                start_after: pagination.start_after,
                limit: pagination.limit
            }
        }
    }

    export type GetBidsResponse = {
        bids: [
            {
                bidder: string,
                amount: Uint128,
                timestamp: string
            }
        ]
    }

    interface PlaceBidMsg {
        tokenId: string;
        tokenAddress: string;
    }

    export const placeBidMsg = (data: PlaceBidMsg) => {
        return {
            place_bid: {
                token_id: data.tokenId,
                token_address: data.tokenAddress,
            },
        }
    }


}

