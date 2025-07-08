import type { CacheEntry } from "@epic-web/cachified";
import { cachified } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";
import { LcdClient } from "@/lib/andrjs/lcd-client";
import { APP_CONTRACT } from "@/lib/andrjs/ados/app-contract";
import { RpcClient } from "@/lib/andrjs/rpc-client/client";

const cache = new LRUCache<string, CacheEntry>({
  max: 5,
});

export async function queryAppGetComponents(
  client: RpcClient | LcdClient,
  contractAddress: string,
) {
  return cachified({
    key: ["query", "app", contractAddress, "getComponents"].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const components =
        await client.queryContractSmart<APP_CONTRACT.GetComponentsResponse>(
          contractAddress,
          APP_CONTRACT.getComponentsMsg(),
        );
      return components;
    },
  });
}

export async function queryAppGetAddressesWithNames(
  client: RpcClient | LcdClient,
  contractAddress: string,
) {
  return cachified({
    key: ["query", "app", contractAddress, "getAddressesWithNames"].join("-"),
    cache,
    ttl: 1000 * 60 * 5, // 5 minutes
    getFreshValue: async () => {
      const addresses =
        await client.queryContractSmart<APP_CONTRACT.GetAddressesWithNamesResponse>(
          contractAddress,
          APP_CONTRACT.getAddressesWithNamesMsg(),
        );
      return addresses;
    },
  });
}
