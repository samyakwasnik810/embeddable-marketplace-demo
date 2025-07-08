import { Expiration } from "@andromedaprotocol/andromeda.js";
import { OrderBy, Recipient, Uint128 } from "./types";

export namespace MARKETPLACE {
    export type Status = 'open' | 'expired' | 'executed' | 'cancelled';

    export const latestSaleStateMsg = (tokenAddress: string, tokenId: string) => {
        return {
            latest_sale_state: {
                token_address: tokenAddress,
                token_id: tokenId
            }
        };
    };

    export interface LatestSaleStateResponse {
        coin_denom: string;
        end_time: Expiration;
        price: Uint128;
        recipient?: Recipient | null;
        sale_id: Uint128;
        start_time: Expiration;
        status: Status;
    }

    export const saleStateMsg = (saleId: Uint128) => {
        return {
            sale_state: {
                sale_id: saleId
            }
        };
    };

    export interface SaleStateResponse {
        coin_denom: string;
        end_time: Expiration;
        price: Uint128;
        recipient?: Recipient | null;
        sale_id: Uint128;
        start_time: Expiration;
        status: Status;
    }

    export const saleIdsMsg = (tokenAddress: string, tokenId: string) => {
        return {
            sale_ids: {
                token_address: tokenAddress,
                token_id: tokenId
            }
        };
    };

    export interface SaleIdsResponse {
        sale_ids: Uint128[];
    }

    export const saleInfosForAddressMsg = (tokenAddress: string, limit?: number | null, startAfter?: string | null) => {
        return {
            sale_infos_for_address: {
                token_address: tokenAddress,
                limit: limit ?? null,
                start_after: startAfter ?? null
            }
        };
    };

    export interface SaleInfo {
        sale_ids: Uint128[];
        token_address: string;
        token_id: string;
    }

    export type PermissionAction = 'send_cw20' | 'send_nft';


    export const authorizedAddressesMsg = (action: PermissionAction, limit?: number | null, orderBy?: OrderBy | null, startAfter?: string | null) => {
        return {
            authorized_addresses: {
                action: action,
                limit: limit ?? null,
                order_by: orderBy ?? null,
                start_after: startAfter ?? null
            }
        };
    };

    export interface AuthorizedAddressesResponse {
        addresses: string[];
    }

}

