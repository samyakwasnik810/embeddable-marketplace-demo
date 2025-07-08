import { z } from "zod";

import { KERNEL } from "@/lib/andrjs/ados/kernel";
import { withChainConfig } from "@/lib/trpc/procedures";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import { queryKernelKeyAddress } from "./query";

export const kernelRouter = createTRPCRouter({
  keyAddress: withChainConfig
    .input(
      z.object({
        key: z.nativeEnum(KERNEL.KernelKey),
      }),
    )
    .query<KERNEL.KeyAddressResponse>(async ({ input, ctx }) => {
      const rpcClient = await ctx.getRpcClient(input["chain-identifier"]);
      return queryKernelKeyAddress(
        rpcClient,
        ctx.chainConfig.kernelAddress,
        input.key,
      );
    }),
});
