import { trpcReactClient } from "@/lib/trpc/client";
import useBuyNowModal from "@/modules/modals/hooks/useBuyNowModal";
import { Button, ButtonProps, HStack } from "@chakra-ui/react";
import React, { FC } from "react";

interface IButtonProps extends ButtonProps {
  marketplaceAddress: string;
  contractAddress: string;
  tokenId: string;
}

const BuyNowButton: FC<IButtonProps> = (props) => {
  const { marketplaceAddress, contractAddress, tokenId, children, ...buttonProps } = props;
  const { data: marketplaceState } = trpcReactClient.ado.marketplace.getLatestSaleState.useQuery({
    "contract-address": contractAddress,
    tokenAddress: contractAddress,
    tokenId: tokenId,
  }, {
    enabled: !!contractAddress && !!tokenId
  })
  const open = useBuyNowModal({ marketplaceAddress, contractAddress, tokenId });

  return (
    <Button onClick={open} w="full" variant="solid" {...buttonProps}>
      Buy for {marketplaceState?.price} {marketplaceState?.coin_denom}
    </Button>
  );
};
export default BuyNowButton;
