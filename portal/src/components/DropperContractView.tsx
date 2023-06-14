/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { Flex, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

import PoolDetailsRow from "./PoolDetailsRow";
import Web3Context from "../contexts/Web3Context/context";

import useDropperContract from "../hooks/useDropper.sol";
import { supportedChains } from "../types";
import { chains } from "../contexts/Web3Context";

const CONNECTION_ERRORS: WalletStatesInterface = {
  ONBOARD: "Cannot retrieve any data. MetaMask isn't installed",
  CONNECT:
    "Cannot retrieve any data. MetaMask is installed, but something is wrong. It could be due to the wrong chain or address.",
  CONNECTED:
    "Cannot retrieve any data. MetaMask is installed and connected, but something is wrong. It could be due to the wrong chain or address.",
  UNKNOWN_CHAIN: "Cannot retrieve any data. Unsupported chain",
  NO_CHAIN_SELECTED: "Cannot retrieve any data. The chain hasn't been selected in MetaMask.",
};

export interface WalletStatesInterface {
  ONBOARD: string;
  CONNECT: string;
  CONNECTED: string;
  NO_CHAIN_SELECTED: string;
  UNKNOWN_CHAIN: string;
}

const DropperContractView = ({
  address,
  addRecentAddress,
}: {
  address: string;
  addRecentAddress: (address: string, fields: Record<string, string>) => void;
}) => {
  const web3ctx = useContext(Web3Context);
  const { contractState } = useDropperContract({ ctx: web3ctx, dropperAddress: address });
  const [connectionStatus, setConnectionStatus] = useState("");

  useEffect(() => {
    if (contractState.data?.owner) {
      addRecentAddress(address, { chainId: String(web3ctx.chainId) });
    }
  }, [contractState.data]);

  const isKnownChain = (_chainId: number) => {
    return Object.keys(chains).some((key) => {
      return chains[key as any as supportedChains].chainId == _chainId;
    });
  };

  useEffect(() => {
    if (
      web3ctx.web3.currentProvider &&
      web3ctx.chainId &&
      web3ctx.targetChain?.chainId &&
      web3ctx.account
    ) {
      if (isKnownChain(web3ctx.chainId)) {
        setConnectionStatus(CONNECTION_ERRORS.CONNECTED);
      } else {
        setConnectionStatus(CONNECTION_ERRORS.UNKNOWN_CHAIN);
      }
    } else {
      if (!window.ethereum) {
        setConnectionStatus(CONNECTION_ERRORS.ONBOARD);
      } else {
        setConnectionStatus(CONNECTION_ERRORS.CONNECT);
      }
    }
  }, [web3ctx.web3.currentProvider, web3ctx.chainId, web3ctx.targetChain, web3ctx.account]);

  return (
    <>
      <Flex bg="#2d2d2d" w="1240px" borderRadius="20px" p="30px" direction="column" gap="20px">
        <Flex gap="30px">
          {contractState.data?.owner && (
            <Flex
              flex="1 1 0px"
              direction="column"
              gap="10px"
              p={5}
              borderRadius="10px"
              bg="#232323"
            >
              <PoolDetailsRow
                type={"Owner"}
                value={
                  contractState.data.owner +
                  (web3ctx.account === contractState.data.owner ? " (you)" : "")
                }
                displayFull={true}
              />
              <PoolDetailsRow type={"Number of drops"} value={contractState.data.numClaims} />

              <PoolDetailsRow type={"Active"} value={String(!contractState.data.paused)} />
            </Flex>
          )}
          {(contractState.isError || connectionStatus !== CONNECTION_ERRORS.CONNECTED) &&
            !contractState.isLoading &&
            !contractState.data && (
              <Flex alignItems="center" gap="10px" color="gray.900">
                <Text fontStyle="italic" color="gray.900">
                  {connectionStatus}
                </Text>
              </Flex>
            )}
          {contractState.isLoading && <Spinner />}
        </Flex>
      </Flex>
    </>
  );
};

export default DropperContractView;
