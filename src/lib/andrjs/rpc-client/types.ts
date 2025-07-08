import { RpcClient as TenderintRpcClient } from "@cosmjs/tendermint-rpc";

export type RpcClientEndpoint =
  | {
      url: string;
      batch?: number; // default 10, 0 for no batching
      batchInterval?: number; // default 1000, 0 for no batching
    }
  | { client: TenderintRpcClient };
