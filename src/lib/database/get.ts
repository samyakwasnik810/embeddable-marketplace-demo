import { cache } from 'react'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { APP_ENV } from '@/appEnv';
import { IAllKeysQueryResponse } from './types';
import { IConfig } from '../app/types';
import { trpcStandaloneClient } from '../trpc/client';

export const getClient = cache(async (chainId: string) => {
    const config = await trpcStandaloneClient.chainConfig.byIdentifier.query({
        "chain-identifier": chainId
    });
    const client = await CosmWasmClient.connect(config.chainUrl);
    return client;
})


export const getConfig = cache(async (key: string, chainId: string) => {
    if (key === APP_ENV.DEFAULT_CONFIG.id && chainId === APP_ENV.DEFAULT_CONFIG.chainId) return APP_ENV.DEFAULT_CONFIG;
    console.log("getConfig", key, chainId)
    const db = process.env.NEXT_PUBLIC_EMBEDDABLE_PATH!;
    const rawConfig = await trpcStandaloneClient.ado.primitive.getValue.query({
        "contract-address": db,
        key: key,
        "chain-identifier": chainId
    });
    if (!("string" in rawConfig.value)) throw new Error("Invalid config");
    const config: IConfig = JSON.parse(rawConfig.value.string);
    config.id = key;
    return config;
})

export const getAllApps = cache(async (chainId: string) => {
    const db = process.env.NEXT_PUBLIC_EMBEDDABLE_PATH!;
    const keys: IAllKeysQueryResponse = await trpcStandaloneClient.ado.primitive.getAllKeys.query({
        "contract-address": db,
        "chain-identifier": chainId
    });
    return keys;
})