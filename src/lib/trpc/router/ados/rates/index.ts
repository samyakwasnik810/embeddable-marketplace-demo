import z from "zod"
import { withContractAddress } from "@/lib/trpc/procedures/withContractAddress";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import { getRate } from "./query";
import { RATES } from "@/lib/andrjs/ados/rates";

export const ratesRouter = createTRPCRouter({

    getRate: withContractAddress
        .input(z.object({ action: z.string() }))
        .query<RATES.GetRateResponse>(async ({ ctx, input }) => {
            const rate = await getRate(
                ctx.chainConfig.lcdUrl,
                ctx.resolvedContractAddress,
                input.action
            )
            return rate
        }),
})