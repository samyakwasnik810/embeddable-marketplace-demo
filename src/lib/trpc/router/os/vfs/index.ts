import { z } from "zod";

import { VFS } from "@/lib/andrjs/ados/vfs";
import { queryVfsResolvePathUsingPathOnly, queryVfsUsername } from "./query";
import { KERNEL } from "@/lib/andrjs/ados/kernel";
import { createTRPCRouter } from "@/lib/trpc/trpc";
import { withChainConfig } from "@/lib/trpc/procedures";
import { queryKernelKeyAddress } from "../kernel/query";

export const vfsRouter = createTRPCRouter({
  username: withChainConfig
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query<VFS.GetUsernameResponse>(async ({ input, ctx }) => {
      const rpcClient = await ctx.getRpcClient(input["chain-identifier"]);
      const vfsAddress = await queryKernelKeyAddress(
        rpcClient,
        ctx.chainConfig.kernelAddress,
        KERNEL.KernelKey.VFS,
      );
      const username = await queryVfsUsername(
        rpcClient,
        vfsAddress,
        input.address,
      );
      return username;
    }),

  resolvePath: withChainConfig
    .input(
      z.object({
        path: VFS.PATH_SCHEMA,
      }),
    )
    .query<VFS.ResolvePathResponse>(async ({ input, ctx }) => {
      const resolvedPath = await queryVfsResolvePathUsingPathOnly(
        ctx.chainList,
        input.path,
        ctx.chainConfig,
        ctx.getRpcClient,
      );
      return resolvedPath;
    }),
});
