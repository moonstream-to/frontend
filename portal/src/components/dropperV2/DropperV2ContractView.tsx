/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { Flex, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

import PoolDetailsRow from "../PoolDetailsRow";
import Web3Context from "../../contexts/Web3Context/context";

import { supportedChains } from "../../types";
import { chains } from "../../contexts/Web3Context";
import { useMutation, useQuery } from "react-query";
import http from "../../utils/httpMoonstream";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import DropperV2RegisterContract from "./DropperV2RegisterContractForm";
const dropperAbi = require("../../web3/abi/DropperV2.json");

const CONNECTION_ERRORS: WalletStatesInterface = {
  ONBOARD: "Cannot retrieve any data. MetaMask isn't installed",
  CONNECT:
    "Cannot retrieve any data. MetaMask is installed, but not connected. It could be due to the wrong chain or address.",
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

const DropperV2ContractView = ({
  address,
  addRecentAddress,
  isContractRegistered,
  setIsContractRegistered,
}: {
  address: string;
  addRecentAddress: (address: string, fields: Record<string, string>) => void;
  isContractRegistered: boolean;
  setIsContractRegistered: (arg0: boolean) => void;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const web3ctx = useContext(Web3Context);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getState = (address: any, ctx: any) => async () => {
    const web3 = ctx.web3;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dropper = new web3.eth.Contract(dropperAbi) as any;
    dropper.options.address = address;
    //eslint-disable-next-line
    const ERC20_TYPE = undefined; //await dropper.methods.erc20_type().call();
    //eslint-disable-next-line
    const ERC721_TYPE = undefined; //await dropper.methods.erc721_type().call();
    //eslint-disable-next-line
    const ERC1155_TYPE = undefined; //await dropper.methods.erc1155_type().call();
    const numClaims = await dropper.methods.numDrops().call();
    const dropperVersion = await dropper.methods.dropperVersion().call();
    const admin = await dropper.methods.adminTerminusInfo().call();
    return { ERC20_TYPE, ERC721_TYPE, ERC1155_TYPE, numClaims, dropperVersion, admin };
  };

  const contractState = useQuery(
    ["dropperContract", "state", address, web3ctx.targetChain?.chainId],
    () => getState(address, web3ctx)(),
    {
      retry: false,
      onError: (e) => {
        console.log(e);
      },
      enabled:
        !!address &&
        web3ctx.web3?.utils.isAddress(web3ctx.account) &&
        !!web3ctx.chainId &&
        web3ctx.chainId === web3ctx.targetChain?.chainId,
    },
  );

  const [connectionStatus, setConnectionStatus] = useState("");

  useEffect(() => {
    if (contractState.data?.numClaims) {
      addRecentAddress(address, { chainId: String(web3ctx.chainId) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractState.data]);

  const isKnownChain = (_chainId: number) => {
    return Object.keys(chains).some((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return chains[key as any as supportedChains].chainId == _chainId;
    });
  };

  const getContracts = () => {
    return http({
      method: "GET",
      url: `https://engineapi.moonstream.to/metatx/contracts`,
    }).then((res) => {
      return {
        ...res.data,
        contractData: res.data.find(
          (contract: { address: string }) => contract.address === address,
        ),
      };
    });
  };

  const contractsQuery = useQuery(["metatxContracts"], getContracts, {
    onSuccess: (data) => {
      setIsContractRegistered(data !== "404");
      console.log(data);
      console.log(data.contractData?.image_uri);
    },
    onError: (e) => {
      console.log(e);
    },
  });

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
        {contractsQuery.data?.contractData && (
          <Text variant="title2">{contractsQuery.data.contractData.title}</Text>
        )}
        <Flex gap="10px">
          <Flex direction="column" gap="20px">
            <Flex gap="20px" flex="1">
              {contractsQuery.data?.contractData?.image_uri && (
                <Image
                  w="140px"
                  h="140px"
                  src={contractsQuery.data.contractData.image_uri}
                  alt="qq"
                  // fallbackSrc="https://via.placeholder.com/140"
                />
              )}
              {contractsQuery.data?.contractData && (
                <Text color={contractsQuery.data.contractData.description ? "white" : "#BBBBBB"}>
                  {contractsQuery.data.contractData.description ?? "no description provided"}
                </Text>
              )}
            </Flex>

            {contractsQuery.data && !contractsQuery.data.contractData && contractState.data && (
              <Flex gap="20px" position="relative" my="auto">
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalBody w="fit-content">
                      <DropperV2RegisterContract
                        onClose={onClose}
                        address={address}
                        refetch={contractsQuery.refetch}
                      />
                    </ModalBody>
                  </ModalContent>
                </Modal>
                <Button
                  variant="transparent"
                  fontWeight="400"
                  fontSize="18px"
                  border="1px solid white"
                  onClick={onOpen}
                  mr="20px"
                >
                  Register contract
                </Button>
              </Flex>
            )}
          </Flex>

          {/* <Flex gap="30px"> */}
          {contractState.data?.numClaims && (
            <Flex
              flex="1 1 0px"
              direction="column"
              gap="10px"
              p={5}
              borderRadius="10px"
              bg="#232323"
            >
              <PoolDetailsRow
                type={"Dropper version"}
                value={`${contractState.data.dropperVersion["0"]} v${contractState.data.dropperVersion["1"]}`}
              />
              <PoolDetailsRow type={"Number of drops"} value={contractState.data.numClaims} />
              <PoolDetailsRow
                type={"Admin terminus address"}
                value={contractState.data.admin.terminusAddress}
                href={`/portal/terminus/?contractAddress=${contractState.data.admin.terminusAddress}`}
                canBeCopied
                displayFull
                whiteSpace="nowrap"
              />
              <PoolDetailsRow
                type={"Admin terminus pool"}
                value={contractState.data.admin.poolId}
                href={`/portal/terminus/?contractAddress=${contractState.data.admin.terminusAddress}&poolId=${contractState.data.admin.poolId}`}
              />
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

export default DropperV2ContractView;
