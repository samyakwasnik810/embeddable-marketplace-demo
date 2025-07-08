import { AUCTION } from "@/lib/andrjs/ados/auction";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import z from "zod"
import { queryAuctionLatestSaleState, queryBids } from "./query";



export const auctionRouter = createTRPCRouter({
    getLatestAuctionState: withContractAddress
        .input(z.object({ tokenAddress: z.string(), tokenId: z.string() }))
        .query<AUCTION.GetLatestSaleStatePesponse>(async ({ input, ctx }) => {
            const saleState = await queryAuctionLatestSaleState(
                ctx.chainConfig.lcdUrl,
                ctx.resolvedContractAddress,
                input.tokenAddress,
                input.tokenId
            );
            return saleState
        }),

    getBids: withContractAddress
        .input(z.object({ auctionId: z.string(), pagination: z.custom<AUCTION.GetBidsPagination>().optional() }))
        .query<AUCTION.GetBidsResponse>(async ({ input, ctx }) => {
            const bids = await queryBids(
                ctx.chainConfig.lcdUrl,
                ctx.resolvedContractAddress,
                input.auctionId,
                input.pagination,
            )
            return bids
        })
})