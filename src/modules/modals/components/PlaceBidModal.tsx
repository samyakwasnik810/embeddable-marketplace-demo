import useApp from "@/lib/app/hooks/useApp";
import { NumberInput } from "@/modules/common/ui";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import { coins } from "@cosmjs/proto-signing";
import { FC, useState } from "react";
import { useExecuteModal } from "../hooks";
import { PlaceBidModalProps } from "../types";
import { trpcReactClient } from "@/lib/trpc/client";
import { AUCTION } from "@/lib/andrjs/ados/auction";
import PromiseButton from "@/modules/common/ui/PromiseButton";

const PlaceBidModal: FC<PlaceBidModalProps> = (props) => {
  const { contractAddress, tokenId, auctionAddress } = props;
  const { data: token } = trpcReactClient.ado.cw721.getTokenInfo.useQuery({
    "contract-address": contractAddress,
    tokenId,
  });
  const { data: tokenData } = trpcReactClient.ado.cw721.fetchTokenData.useQuery({
    token_uri: token?.token_uri ?? ""
  }, {
    enabled: !!token?.token_uri
  });

  const { data: auctionState } = trpcReactClient.ado.auction.getLatestAuctionState.useQuery({
    tokenAddress: contractAddress,
    tokenId,
    "contract-address": auctionAddress
  }, {
    enabled: !!contractAddress && !!tokenId && !!auctionAddress
  });
  const { config } = useApp();
  const utils = trpcReactClient.useUtils();
  const { data: resolvedAuctionAddress } = trpcReactClient.os.vfs.resolvePath.useQuery({
    "chain-identifier": config.chainId,
    path: auctionAddress
  }, {
    enabled: !!config.chainId && !!auctionAddress
  });
  // Execute place bid directly on auction
  const openExecute = useExecuteModal(resolvedAuctionAddress ?? "");

  const MIN_BID = Math.max(
    0,
    Number(auctionState?.min_bid ?? 0),
    Number(auctionState?.high_bidder_amount ?? 0)
  );

  const DENOM = auctionState?.coin_denom ?? config?.coinDenom ?? "ujunox";

  const [amount, setAmount] = useState(MIN_BID);

  const onSubmit = async () => {
    const resolvedTokenAddress = await utils.os.vfs.resolvePath.fetch({
      "chain-identifier": config.chainId,
      path: contractAddress
    });
    const msg = AUCTION.placeBidMsg({ tokenAddress: resolvedTokenAddress, tokenId: tokenId });
    const funds = coins(amount, DENOM);
    openExecute(msg, true, funds);
  };

  return (
    <Box>
      <Heading size="md" mb="6" fontWeight="bold">
        Place Bid
      </Heading>
      <Text textStyle="light" mb="4">
        You are about to place bid for <b>{tokenData?.name ?? "Unknown"}</b>
        <br />
        Token Id: {tokenId}
        <br />
        Auction Id: {auctionState?.auction_id}
      </Text>
      <Box>
        <FormControl>
          <FormLabel>Your Bid</FormLabel>
          <HStack>
            <Box w="full">
              <NumberInput
                defaultValue={MIN_BID}
                min={MIN_BID}
                value={amount}
                onChange={(valS, valNum) => {
                  setAmount(valNum);
                }}
              />
            </Box>
            <Text>{DENOM.toUpperCase()}</Text>
          </HStack>
          <FormHelperText>
            Highest bid: {auctionState?.high_bidder_amount ?? "None"} {DENOM}
          </FormHelperText>
          <PromiseButton onClick={onSubmit} w="full" mt="6" variant="solid" isLoading={!resolvedAuctionAddress}>
            Place a bid
          </PromiseButton>
        </FormControl>
      </Box>
    </Box>
  );
};

export default PlaceBidModal;
