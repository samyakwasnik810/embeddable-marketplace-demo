import {
  IbcExtension,
  QueryClient,
  setupIbcExtension,
  setupTxExtension,
  TxExtension,
} from "@cosmjs/stargate";
import {
  Tendermint37Client,
  CometClient,
  RpcClient as TenderintRpcClient,
} from "@cosmjs/tendermint-rpc";
import { RpcClientEndpoint } from "./types";
import { setupWasmExtension, WasmExtension } from "@cosmjs/cosmwasm-stargate";
import { HttpBatchClient } from "./batch-client";

/**
 * Rpc client for Andromeda.
 * It helps in creating batch transactions and prevent rate limiting errors due to multiple requests.
 */
export class RpcClient {
  private _cometClient?: CometClient;
  private _client?: QueryClient & TxExtension & WasmExtension & IbcExtension;

  private constructor(cometClient: CometClient) {
    this._cometClient = cometClient;
    this._client = QueryClient.withExtensions(
      this._cometClient,
      setupTxExtension,
      setupWasmExtension,
      setupIbcExtension,
    );
  }

  static create(cometClient: CometClient) {
    return new RpcClient(cometClient);
  }

  static async connect(endpoint: RpcClientEndpoint): Promise<RpcClient> {
    let rpcClient: TenderintRpcClient;
    if ("url" in endpoint) {
      rpcClient = new HttpBatchClient(endpoint.url, {
        batchSizeLimit: endpoint.batch ?? 10,
        dispatchInterval: endpoint.batchInterval,
      });
    } else {
      rpcClient = endpoint.client;
    }
    const cometClient = await Tendermint37Client.create(rpcClient);
    return new RpcClient(cometClient);
  }

  /**
   * Get the client.
   * @returns The client.
   */
  public async getClient() {
    if (!this._client) {
      throw new Error("Client not initialized");
    }
    return this._client;
  }

  /**
   * Get the comet client.
   * @returns The comet client.
   */
  public async getCometClient() {
    if (!this._cometClient) {
      throw new Error("Comet client not initialized");
    }
    return this._cometClient;
  }

  async queryContractSmart<T, Q = unknown>(
    contractAddress: string,
    query: Q,
  ): Promise<T> {
    const client = await this.getClient();
    const result = await client.wasm.queryContractSmart(contractAddress, query);
    return result;
  }
}

export default RpcClient;
