import { MARKETPLACE } from "@/lib/andrjs/ados/marketplace";
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import z from "zod"
import { queryMarketplaceLatestSaleState } from "./query";

export const marketplaceRouter = createTRPCRouter({
    getLatestSaleState: withContractAddress
        .input(z.object({ tokenAddress: z.string(), tokenId: z.string() }))
        .query<MARKETPLACE.LatestSaleStateResponse>(async ({ ctx, input }) => {
            const latestSaleState = await queryMarketplaceLatestSaleState(
                ctx.chainConfig.lcdUrl,
                ctx.resolvedContractAddress,
                input.tokenAddress,
                input.tokenId
            );
            return latestSaleState;
        }),
})