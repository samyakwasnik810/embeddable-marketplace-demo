
// import useCrowdfundGroupBuyModal from "@/modules/modals/hooks/useCrowdfundGroupBuyModal";
import { Button, ButtonProps } from "@chakra-ui/react";
import React, { FC } from "react";

interface IButtonProps extends ButtonProps {
  crowdfundAddress: string;
}

const CrowdfundGroupBuyButton: FC<IButtonProps> = (props) => {
  const { crowdfundAddress, children, ...buttonProps } = props;

  // const open = useCrowdfundGroupBuyModal({ crowdfundAddress });

  return (
    <Button w="full" variant="solid" {...buttonProps}>
      Buy Now
    </Button>
  );
};
export default CrowdfundGroupBuyButton;
