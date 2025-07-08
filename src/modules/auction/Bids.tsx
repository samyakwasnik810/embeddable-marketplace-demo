import { ProfileIcon } from "@/modules/common/icons";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import useApp from "@/lib/app/hooks/useApp";
import { truncateAddress } from "@/utils/text";
import { trpcReactClient } from "@/lib/trpc/client";
import { AUCTION } from "@/lib/andrjs/ados/auction";

interface AuctionBidsProps {
  auctionState: AUCTION.GetLatestSaleStatePesponse;
  auctionAddress: string;
}

const AuctionBids: FC<AuctionBidsProps> = (props) => {
  const { auctionState, auctionAddress } = props;
  const { config } = useApp();
  const { data: chainConfig } = trpcReactClient.chainConfig.byIdentifier.useQuery({
    "chain-identifier": config.chainId
  });
  const { data: bids } = trpcReactClient.ado.auction.getBids.useQuery({
    "contract-address": auctionAddress,
    auctionId: auctionState?.auction_id?.toString() ?? "",
  }, {
    enabled: !!auctionAddress && !!auctionState?.auction_id
  });

  return (
    <Box border="1px" borderColor="gray.300" borderRadius="15" p="10" data-testid="auction-bids">
      {bids && [...bids.bids].reverse().map((bid, index) => (
        <Box key={index} mt="4" data-testid={`auction-bid-${index}`}>
          <Flex justifyContent="space-between">
            <Link
              href={chainConfig?.blockExplorerAddressPages[0].replace('${address}', '') + bid.bidder}
              target="_blank"
              data-testid={`bidder-link-${index}`}
            >
              <ProfileIcon boxSize={"2em"} mr="15px" />
              {truncateAddress(bid.bidder)}
            </Link>
            <Text fontWeight="light" fontSize="sm" data-testid={`bid-amount-${index}`}>
              {bid.amount}<span> - {auctionState?.coin_denom?.toUpperCase()}</span>
            </Text>
          </Flex>
          <Divider orientation="horizontal" mt="7" />
        </Box>
      ))}
    </Box>
  );
};

export default AuctionBids;
