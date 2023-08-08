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
import { Button } from "@chakra-ui/react";
const dropperAbi = require("../../web3/abi/DropperV2.json");

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
  const web3ctx = useContext(Web3Context);
  // const { contractState } = useDropperContract({ ctx: web3ctx, dropperAddress: address });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getState = (address: any, ctx: any) => async () => {
    const web3 = ctx.web3;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dropper = new web3.eth.Contract(dropperAbi) as any;
    dropper.options.address = address;
    // console.log("11,", dropper.methods);

    //eslint-disable-next-line
    const ERC20_TYPE = undefined; //await dropper.methods.erc20_type().call();
    //eslint-disable-next-line
    const ERC721_TYPE = undefined; //await dropper.methods.erc721_type().call();
    //eslint-disable-next-line
    const ERC1155_TYPE = undefined; //await dropper.methods.erc1155_type().call();
    const numClaims = await dropper.methods.numDrops().call();
    // const owner = await dropper.methods.owner().call();
    // const paused = await dropper.methods.dropStatus().call();
    // console.log(numClaims);
    const dropperVersion = await dropper.methods.dropperVersion().call();
    const admin = await dropper.methods.adminTerminusInfo().call();
    console.log(admin);

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
    }).then((res) => res.data);
  };

  const contractsQuery = useQuery(["metatxContracts"], getContracts, {
    onSuccess: (data) => {
      setIsContractRegistered(
        data.some((contract: { address: string }) => contract.address === address),
      );
      console.log(data);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const registerContract = () => {
    return http({
      method: "POST",
      url: "https://engineapi.moonstream.to/metatx/contracts",
      data: {
        blockchain: "mumbai",
        address: "0x6FF32C81600Ec625c68b0D687ba3C2681eD43870",
        contract_type: "dropper-v0.2.0",
        title: "Test",
      },
    });
  };

  const addContract = useMutation(registerContract, {
    onSuccess: () => {
      contractsQuery.refetch();
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
        <Flex gap="30px">
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
                canBeCopied
                displayFull
              />
              {/*TODO add links to terminus */}
              <PoolDetailsRow
                type={"Admin terminus pool"}
                value={contractState.data.admin.poolId}
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
        {!isContractRegistered ? (
          <Flex gap="20px" placeSelf="end" position="relative">
            <Button
              variant="transparent"
              fontWeight="400"
              fontSize="18px"
              border="1px solid white"
              onClick={() => addContract.mutate()}
              color={addContract.isLoading ? "#2d2d2d" : "white"}
            >
              Register contract
            </Button>
            {addContract.isLoading && (
              <Spinner position="absolute" left="50%" top="10px" zIndex="2" h="20px" w="20px" />
            )}
          </Flex>
        ) : (
          <Flex direction="column" px={5} alignItems="end">
            <Text>Contract is registered</Text>
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default DropperV2ContractView;
