/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";

import PoolDetailsRow from "../PoolDetailsRow";
import Web3Context from "../../contexts/Web3Context/context";
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import queryCacheProps from "../../hooks/hookCommon";
import { MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";
import { LinkIcon } from "@chakra-ui/icons";
import useTerminus from "../../contexts/TerminusContext";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import AddEntityButton from "../entity/AddEntityButton";
import { chainByChainId } from "../../contexts/Web3Context";
import { AiOutlineSave } from "react-icons/ai";
import { useJournal } from "../../hooks/useJournal";
import EntitySelect from "../entity/EntitySelect";
import Web3Address from "../entity/Web3Address";

const terminusAbi = require("../../web3/abi/MockTerminus.json");
const multicallABI = require("../../web3/abi/Multicall2.json");

const TerminusPoolView = () => {
  const { chainId, web3, account } = useContext(Web3Context);
  const accounts = useJournal({ tags: ["accounts"] });
  const dropperContracts = useJournal({ tags: ["dropperContracts"] });

  const { contractAddress, selectedPool, poolMetadata } = useTerminus();
  const headerMeta = ["name", "description", "image", "attributes"];
  const [newUri, setNewUri] = useState("");
  const [newPoolController, setNewPoolController] = useState("");
  const [mintTo, setMintTo] = useState("");
  const [mintingAmount, setMintingAmount] = useState("");
  const [operator, setOperator] = useState("");

  const terminusFacet = new web3.eth.Contract(terminusAbi) as any as MockTerminus;
  terminusFacet.options.address = contractAddress;
  const toast = useToast();
  const commonProps = {
    onError: () => {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  };

  useEffect(() => {
    setNewUri("");
    poolState.refetch();
  }, [selectedPool]);

  const mintTokens = useMutation(
    ({ to, poolID, amount }: { to: string; poolID: number; amount: number }) =>
      terminusFacet.methods
        .mint(to, poolID, amount, "0x0")
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    {
      ...commonProps,
      onSuccess: () => {
        toast({
          title: `Successfully minted`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    },
  );

  const queryClient = useQueryClient();
  const setPoolURI = useMutation(
    ({ uri, selectedPool: poolId }: { uri: string; selectedPool: number }) =>
      terminusFacet.methods
        .setURI(poolId, uri)
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    {
      ...commonProps,
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries("poolsList");
          queryClient.invalidateQueries("poolState");
        }, 1000);
        toast({
          title: "Successfully updated contract",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    },
  );

  const setPoolController = useMutation(
    ({ controller, poolId }: { controller: string; poolId: number }) =>
      terminusFacet.methods
        .setPoolController(poolId, controller)
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    {
      ...commonProps,
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries("poolsList");
          queryClient.invalidateQueries("poolState");
        }, 1000);
        toast({
          title: "Successfully updated contract",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    },
  );

  const approveForPool = useMutation(
    ({ operator, poolId }: { operator: string; poolId: number }) =>
      terminusFacet.methods
        .approveForPool(poolId, operator)
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    {
      ...commonProps,
      onSuccess: () => {
        toast({
          title: "Successfully updated contract",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    },
  );

  const handleNewUri = () => {
    setPoolURI.mutate({ uri: newUri, selectedPool: selectedPool });
  };

  const poolState = useQuery(
    ["poolState", contractAddress, selectedPool, chainId],
    async () => {
      const MULTICALL2_CONTRACT_ADDRESS =
        MULTICALL2_CONTRACT_ADDRESSES[
          String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES
        ];
      if (!contractAddress || !MULTICALL2_CONTRACT_ADDRESS) {
        return;
      }

      const terminusContract = new web3.eth.Contract(
        terminusAbi,
        contractAddress,
      ) as unknown as MockTerminus;
      const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS);
      const target = contractAddress;
      const callDatas = [];
      callDatas.push(terminusContract.methods.terminusPoolController(selectedPool).encodeABI());
      callDatas.push(terminusContract.methods.poolIsBurnable(selectedPool).encodeABI());
      callDatas.push(terminusContract.methods.poolIsTransferable(selectedPool).encodeABI());
      callDatas.push(terminusContract.methods.terminusPoolCapacity(selectedPool).encodeABI());
      callDatas.push(terminusContract.methods.terminusPoolSupply(selectedPool).encodeABI());
      callDatas.push(terminusContract.methods.uri(selectedPool).encodeABI());

      const queries = callDatas.map((callData) => {
        return {
          target,
          callData,
        };
      });
      return multicallContract.methods
        .tryAggregate(false, queries)
        .call()
        .then((results: string[][]) => {
          const parsedResults = results.map((result: string[], idx: number) => {
            if (result[1] === "0x") {
              return undefined;
            }
            let parsed;
            try {
              parsed = web3.utils.hexToNumberString(result[1]);
              if (idx === 0) {
                const adr = "0x" + result[1].slice(-40);
                parsed = web3.utils.toChecksumAddress(adr);
              }
              if (idx === 1 || idx === 2) {
                if (Number(parsed) === 1 || Number(parsed) === 0) {
                  parsed = !!Number(parsed);
                } else {
                  parsed = undefined;
                }
              }
              if (idx === 5) {
                if (!web3.utils.hexToUtf8(result[1]).split("https://")[1]) {
                  return undefined;
                }
                parsed = "https://" + web3.utils.hexToUtf8(result[1]).split("https://")[1];
              }
            } catch (e) {
              parsed = undefined;
            }
            return parsed;
          });
          return {
            controller: parsedResults[0],
            isBurnable: parsedResults[1],
            isTransferable: parsedResults[2],
            capacity: parsedResults[3],
            supply: parsedResults[4],
            uri: parsedResults[5],
          };
        })
        .catch((e: any) => {
          console.log(e);
        });
    },
    {
      ...queryCacheProps,
    },
  );

  const copyPoolAddress = () => {
    navigator.clipboard
      .writeText(`${window.location.href}&poolId=${selectedPool}`)
      .then(() => {
        toast({
          duration: 3000,
          render: () => (
            <Box borderRadius="10px" textAlign="center" color="black" p={3} bg="green.800">
              Copied to clipboard
            </Box>
          ),
        });
      })
      .catch((e) => {
        toast({
          duration: 3000,
          render: () => (
            <Box borderRadius="10px" textAlign="center" color="black" p={3} bg="red.800">
              {e}
            </Box>
          ),
        });
      });
  };

  return (
    <Flex
      id="poolView"
      bg="#2d2d2d"
      minW="800px"
      borderRadius="20px"
      p="30px"
      color="white"
      direction="column"
      w={"100%"}
    >
      <Flex gap={2}>
        {poolState.isFetching && <Spinner />}
        <Text
          textAlign="start"
          color="#c2c2c2"
          w="fit-content"
          py={1}
          pr={0}
          borderBottom="1px solid #c2c2c2"
          fontSize="20px"
          mb="20px"
        >
          {`pool ${selectedPool}`}
        </Text>
        <IconButton
          bg="transparent"
          onClick={copyPoolAddress}
          color="#c2c2c2"
          _hover={{ bg: "transparent", color: "white" }}
          icon={<LinkIcon />}
          aria-label="copy link"
        />
      </Flex>
      {!!poolState.data && (
        <>
          {poolMetadata?.name && (
            <Text fontWeight="700" fontSize="24px" mb="20px">
              {poolMetadata.name}
            </Text>
          )}
          <Flex direction="column" gap="20px" overflowY="auto">
            <Flex gap="20px">
              {poolMetadata?.image && (
                <Image
                  w="140px"
                  h="140px"
                  borderRadius="20px"
                  src={poolMetadata.image}
                  alt="image"
                />
              )}
              {poolMetadata?.description && (
                <Box maxW={"580px"}>
                  <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                    {poolMetadata.description}
                  </ReactMarkdown>
                </Box>
              )}
            </Flex>
            {poolState.data.controller && (
              <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
                <Web3Address
                  address={poolState.data.controller}
                  label={"controller"}
                  entityTag={"accounts"}
                  blockchain={chainByChainId(chainId) ?? ""}
                  isTruncated
                  fontSize={"18px"}
                />
                <PoolDetailsRow type="capacity" value={poolState.data.capacity} />
                <PoolDetailsRow type="supply" value={poolState.data.supply} />
                <PoolDetailsRow
                  type="burnable"
                  value={poolState.data.isBurnable ? "true" : "false"}
                />
                <PoolDetailsRow
                  type="transferable"
                  value={poolState.data.isTransferable ? "true" : "false"}
                />
                <PoolDetailsRow type="uri" value={poolState.data.uri} />
                {poolMetadata && (
                  <>
                    <Text fontWeight="700" mt="20px">
                      Metadata:
                    </Text>
                    {Object.keys(poolMetadata)
                      .filter((key) => !headerMeta.includes(key))
                      .map((key) => {
                        return (
                          <PoolDetailsRow key={key} type={key} value={String(poolMetadata[key])} />
                        );
                      })}
                  </>
                )}
                {poolMetadata?.attributes && (
                  <>
                    <Text fontWeight="700" mt="20px">
                      Attributes:
                    </Text>

                    {poolMetadata.attributes.map(
                      (attribute: { trait_type: string; value: string }) => (
                        <PoolDetailsRow
                          key={attribute.trait_type}
                          type={attribute.trait_type}
                          value={String(attribute.value)}
                        />
                      ),
                    )}
                  </>
                )}
              </Flex>
            )}
          </Flex>
          {poolState.data && poolState.data.controller === account && (
            <Flex gap="15px" mt="20px">
              <Input
                placeholder="new uri"
                value={newUri}
                onChange={(e) => setNewUri(e.target.value)}
                type="url"
                isDisabled={setPoolURI.isLoading}
              />
              <Button
                bg="gray.0"
                fontWeight="400"
                fontSize="18px"
                color="#2d2d2d"
                onClick={handleNewUri}
                isDisabled={setPoolURI.isLoading}
              >
                {setPoolURI.isLoading ? <Spinner /> : "Save"}
              </Button>
            </Flex>
          )}
          {poolState.data && poolState.data.controller === account && (
            <Flex gap="15px" mt="20px">
              <Input
                placeholder="new pool controller"
                value={newPoolController}
                onChange={(e) => setNewPoolController(e.target.value.trim())}
                type="url"
                isDisabled={setPoolController.isLoading}
              />
              {!accounts.data?.entities.some((e) => e.address === newPoolController) &&
                web3.utils.isAddress(newPoolController) && (
                  <AddEntityButton
                    address={newPoolController}
                    tags={["accounts"]}
                    blockchain={chainByChainId(chainId) ?? ""}
                    w={"40px"}
                    h={"40px"}
                  >
                    <AiOutlineSave />
                  </AddEntityButton>
                )}
              <EntitySelect tags={["accounts"]} onChange={setNewPoolController}>
                ...
              </EntitySelect>
              <Button
                bg="gray.0"
                fontWeight="400"
                fontSize="18px"
                color="#2d2d2d"
                onClick={() =>
                  setPoolController.mutate({
                    controller: newPoolController,
                    poolId: selectedPool,
                  })
                }
                isDisabled={setPoolController.isLoading}
              >
                {setPoolController.isLoading ? <Spinner /> : "Save"}
              </Button>
            </Flex>
          )}
          {poolState.data && poolState.data.controller === account && (
            <Flex gap="15px" mt="20px">
              <Input
                placeholder="amount"
                value={mintingAmount}
                onChange={(e) => setMintingAmount(e.target.value.trim())}
                isDisabled={mintTokens.isLoading}
                flex="0"
                minW="15ch"
              />
              <Input
                placeholder="mint to"
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value.trim())}
                type="url"
                isDisabled={mintTokens.isLoading}
                minW="45ch"
              />
              {!accounts.data?.entities.some((e) => e.address === mintTo) &&
                web3.utils.isAddress(mintTo) && (
                  <AddEntityButton
                    address={mintTo}
                    tags={["accounts"]}
                    blockchain={chainByChainId(chainId) ?? ""}
                    w={"40px"}
                    h={"40px"}
                  >
                    <AiOutlineSave />
                  </AddEntityButton>
                )}
              <EntitySelect tags={["accounts"]} onChange={setMintTo}>
                ...
              </EntitySelect>
              <Button
                bg="gray.0"
                fontWeight="400"
                fontSize="18px"
                color="#2d2d2d"
                onClick={() =>
                  mintTokens.mutate({
                    to: mintTo,
                    poolID: selectedPool,
                    amount: Number(mintingAmount),
                  })
                }
                isDisabled={mintTokens.isLoading}
              >
                {mintTokens.isLoading ? <Spinner /> : "Mint"}
              </Button>
            </Flex>
          )}
          {poolState.data && poolState.data.controller === account && (
            <Flex gap="15px" mt="20px">
              <Input
                placeholder="operator"
                value={operator}
                onChange={(e) => setOperator(e.target.value.trim())}
                isDisabled={approveForPool.isLoading}
              />
              {!dropperContracts.data?.entities.some((e) => e.address === operator) &&
                web3.utils.isAddress(operator) && (
                  <AddEntityButton
                    address={operator}
                    tags={["dropperContracts"]}
                    blockchain={chainByChainId(chainId) ?? ""}
                    w={"40px"}
                    h={"40px"}
                  >
                    <AiOutlineSave />
                  </AddEntityButton>
                )}
              <EntitySelect tags={["dropperContracts"]} onChange={setOperator}>
                ...
              </EntitySelect>
              <Button
                bg="gray.0"
                fontWeight="400"
                fontSize="18px"
                color="#2d2d2d"
                onClick={() => approveForPool.mutate({ operator, poolId: selectedPool })}
                isDisabled={approveForPool.isLoading}
                minW="fit-content"
              >
                {approveForPool.isLoading ? <Spinner /> : "Approve this pool"}
              </Button>
            </Flex>
          )}
        </>
      )}
      {!poolState.data && (
        <Flex alignItems="center" justifyContent="center" h="100%">
          <Spinner h="50px" w="50px" />
        </Flex>
      )}
    </Flex>
  );
};

export default TerminusPoolView;
