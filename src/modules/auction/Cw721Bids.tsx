import React, { FC } from "react";
import AuctionBids from "./Bids";
import { trpcReactClient } from "@/lib/trpc/client";


interface Cw721AuctionBidsProps {
    auctionAddress: string;
    tokenId: string;
    tokenAddress: string;
}
const Cw721AuctionBids: FC<Cw721AuctionBidsProps> = (props) => {
    const { auctionAddress, tokenId, tokenAddress } = props;
    const { data: auctionState } = trpcReactClient.ado.auction.getLatestAuctionState.useQuery({
        tokenAddress,
        tokenId,
        "contract-address": auctionAddress
    }, {
        enabled: !!auctionAddress && !!tokenId && !!tokenAddress
    });

    if (!auctionState) return null;

    return (
        <AuctionBids auctionState={auctionState} auctionAddress={auctionAddress} />
    );
};
export default Cw721AuctionBids;
