"use client";
import { IExchangeCollection, useAppUtils } from "@/lib/app";
import { notFound } from 'next/navigation'
import React, { FC } from "react"
import ExchangePage from "@/modules/exchange/ExchangePage"
import { trpcReactClient } from "@/lib/trpc/client";

interface Props {
    params: {
        collection: string;
    }
}

const Page: FC<Props> = (props) => {
    const { params: { collection: collectionId } } = props;
    const { getCollection } = useAppUtils();
    const collection = getCollection(collectionId) as IExchangeCollection;
    const { data, error } = trpcReactClient.ado.base.getAdoType.useQuery({
        "contract-address": collection.cw20
    });
    console.log(error, "Error");
    if (error || data?.ado_type !== 'cw20') {
        return notFound()
    }

    return (
        <ExchangePage
            collection={collection}
        />
    )
}

export default Page