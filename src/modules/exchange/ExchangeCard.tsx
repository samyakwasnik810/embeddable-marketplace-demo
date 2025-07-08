import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import React, { ChangeEvent, FC, useMemo } from "react";
import ExchangeInput from "./ExchangeInput";
import { ArrowDownIcon } from "@/modules/common/icons";
import ExchangeCardSummary from "./ExchangeCardSummary";
import { useGetSaleInfo } from "@/lib/andrjs/hooks/ado/exchange";
import useExchangeConfirmModal from "@/modules/modals/hooks/useExchangeConfirmModal";
import useApp from "@/lib/app/hooks/useApp";
import { formatNumber } from "@/utils/number";
import { useAndromedaStore } from "@/zustand/andromeda";
import { useGetCw20, useGetCw20Balance, useGetCw20MarketingInfo } from "@/lib/andrjs/hooks/ado/cw20";
import { ConnectWallet } from "../common/cta";
import useGetBalance from "@/lib/andrjs/hooks/useGetBalance";
import { useChainConfig } from "@/lib/andrjs/hooks/useChainConfig";

interface ExchangeCardProps {
  handleAndrInput: (e: ChangeEvent<HTMLInputElement>) => void;
  nativeAmount: number;
  exchange: string;
  cw20: string;
}

const ExchangeCard: FC<ExchangeCardProps> = (props) => {
  const { handleAndrInput, nativeAmount, exchange, cw20 } = props;
  const { config } = useApp();
  const { accounts, connectedChain } = useAndromedaStore();
  const account = accounts[0];
  const { balance } = useGetBalance(config.coinDenom, account?.address);
  const { data: chainConfig } = useChainConfig(connectedChain);
  const { data: saleInfo } = useGetSaleInfo(exchange, balance.denom);
  const { data: cw20_balance } = useGetCw20Balance(cw20, account?.address);
  const { data: cw20Marketing } = useGetCw20MarketingInfo(cw20);
  const { data: cw20Data } = useGetCw20(cw20);

  const { symbol, total_amount, amount, exchange_rate, cw20_url, cw20_decimals } = useMemo(() => {
    let logo = JSON.parse(JSON.stringify(cw20Marketing?.logo) || "{}");
    let decimals = cw20Data?.decimals || 0;
    let divider = 10 ** decimals;
    let total_amount = (Number(cw20Data?.total_supply) || 0) / divider;
    let amount = (Number(saleInfo?.remaining_amount) || 0) / divider;
    return {
      cw20_decimals: decimals,
      symbol: cw20Data?.symbol || "",
      total_amount: total_amount,
      amount: amount,
      exchange_rate: Number(saleInfo?.exchange_rate) || 0,
      cw20_url: logo && logo["url"]
    };
  }, [saleInfo, cw20Data, cw20Marketing]);

  const open = useExchangeConfirmModal({
    cw20Symbol: symbol,
    nativeAmount: nativeAmount,
    exchangeAddress: exchange,
    exchangeRate: exchange_rate,
    nativeDenom: config.coinDenom
  });

  return (
    <Box borderWidth='1px' borderRadius='lg' padding={6} data-testid="exchange-card">
      <Text fontWeight="bold" fontSize="3xl" data-testid="buy-tokens-title">Buy {symbol} Tokens</Text>
      <Flex gap={6} backgroundColor={"blue.50"} rounded={"sm"} py={1} px={4} mt={6} data-testid="supply-info">
        <Flex gap={1}>
          <Text color={"blackAlpha.600"}>Max Supply</Text>
          <Text fontWeight={"bold"}>{formatNumber(total_amount)} {symbol}</Text>
        </Flex>
        <Flex gap={1}>
          <Text color={"blackAlpha.600"}>Available for Purchase</Text>
          <Text fontWeight={"bold"}>{formatNumber(amount)} {symbol}</Text>
        </Flex>
      </Flex>
      <Box mt={6}>
        <Flex justify={"space-between"} mb={2} data-testid="balance-info">
          <Text color={"blackAlpha.600"}>You pay in {account ? balance.denom : "uandr"}</Text>
          <Text color={"#5B6BCF"} decoration={"underline"}>Balance: {balance.amount}</Text>
        </Flex>
        <ExchangeInput onChange={handleAndrInput} value={nativeAmount} icon={chainConfig?.iconUrls?.sm || ''} symbol={symbol} />
      </Box>
      <Box textAlign={"center"} my={4}>
        <ArrowDownIcon color={"#5B6BCF"} />
      </Box>
      {account ? (
        <Box data-testid="exchange-actions">
          <Box mb={6}>
            <Flex justify={"space-between"} mb={2}>
              <Text color={"blackAlpha.600"}>You get {symbol}</Text>
            </Flex>
            <Flex justify={"space-between"} align={"center"} mb={2} background={"gray.100"} py={2} px={3} borderRadius={"lg"} data-testid="token-receive-info">
              <Text fontWeight={"bold"}>{Math.floor(nativeAmount / exchange_rate) || 0}</Text>
              <Image src={cw20_url} alt={symbol} w="8" />
            </Flex>
          </Box>
          <Button backgroundColor={"gray.900"} display={"block"} width={"full"} onClick={open} isDisabled={nativeAmount == 0} data-testid="buy-button">
            Buy
          </Button>
          <ExchangeCardSummary
            rate={exchange_rate}
            estimatedCost={nativeAmount}
            balance={balance}
            cw20_balance={Number(cw20_balance?.balance || "0")}
            cw20_decimals={cw20_decimals || 0}
            targetSymbol={symbol}
          />
        </Box>
      ) : (
        <Flex justify={"center"} data-testid="connect-wallet">
          <ConnectWallet />
        </Flex>
      )}
    </Box>
  );
};

export default ExchangeCard;
