import { z } from "zod";

import { VFS } from "@/lib/andrjs/ados/vfs";
import { queryVfsResolvePathUsingPathOnly } from "../router/os/vfs/query";
import { IChainConfig } from "../router/chain/types";
import { bech32 } from "bech32";
import { withRpcClient } from "./withRpcClient";


/**
 * Resolves a contract address to a chain config and address.
 * If the address is a bech32 address, it will be resolved to a chain config and address.
 * If the address is a VFS path, it will be resolved to a chain config and address.
 * If the address is a chain identifier, it will be resolved to a chain config and address.
 * @param address - The address to resolve.
 * @param chainConfigs - The chain configs to use.
 * @param chainConfig - The chain config to use.
 * @returns The resolved contract address and chain config.
 */
const resolveContractAddress = (address: string, chainConfigs: IChainConfig[], chainIdentifier?: string) => {
  let chainConfig: IChainConfig | undefined;
  if (!chainIdentifier) {
    const bech32Prefix = bech32.decode(address).prefix;
    chainConfig = chainConfigs.find(c => c.addressPrefix === bech32Prefix);
  } else {
    chainConfig = chainConfigs.find(c => c.chainId === chainIdentifier || c.name === chainIdentifier);
  }
  if (!chainConfig) {
    throw new Error(`Chain config not found for ${address}`);
  }
  return {
    address,
    chainConfig,
  };
}


/**
 * Middleware to add chain config to the context.
 * Adds a required chainId to the input and adds the chain config to the context.
 */
export const withContractAddress = withRpcClient
  .input(
    z.object({
      "contract-address": z.union([VFS.PATH_SCHEMA, z.string()]),
      "chain-identifier": z.string().optional(),
    }),
  )
  .use(async ({ ctx, next, input }) => {
    const contractAddress = input["contract-address"];
    if (contractAddress.includes("/")) {
      const chainIdentifier = VFS.getChainIdentifierFromPath(contractAddress) || input["chain-identifier"];
      if (!chainIdentifier) {
        throw new Error(`Chain identifier not found for ${contractAddress}`);
      }
      const chainConfig = ctx.chainList.find(
        (c) =>
          c.chainId === chainIdentifier ||
          c.name === chainIdentifier,
      );
      if (!chainConfig) {
        throw new Error(
          `Chain config not found for ${chainIdentifier}`,
        );
      }
      const resolvedContractAddress = await queryVfsResolvePathUsingPathOnly(
        ctx.chainList,
        contractAddress,
        chainConfig,
      );
      const { address } = resolveContractAddress(resolvedContractAddress, ctx.chainList, chainIdentifier);
      return next({ ctx: { ...ctx, resolvedContractAddress: address, chainConfig } });
    } else {
      const { address, chainConfig } = resolveContractAddress(contractAddress, ctx.chainList);
      return next({ ctx: { ...ctx, resolvedContractAddress: address, chainConfig } });
    }
  });

