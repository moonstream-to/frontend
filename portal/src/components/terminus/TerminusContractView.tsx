/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { useQuery } from "react-query";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import PoolDetailsRow from "../PoolDetailsRow";
import queryCacheProps from "../../hooks/hookCommon";
import Web3Context from "../../contexts/Web3Context/context";
import { queryPublic } from "../../utils/http";
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import { MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";
import useTermiminus from "../../contexts/TerminusContext";
import { useJournal } from "../../hooks/useJournal";
import { chainByChainId } from "../../contexts/Web3Context";
import Web3Address from "../entity/Web3Address";

const terminusAbi = require("../../web3/abi/MockTerminus.json");
const multicallABI = require("../../web3/abi/Multicall2.json");

const TerminusContractView = ({
  addRecentAddress,
}: {
  addRecentAddress: (address: string, fields: Record<string, string>) => void;
}) => {
  const { setContractState, contractAddress } = useTermiminus();
  const errorDialog = [
    "Something is wrong. Is MetaMask connected properly to the right chain?",
    "Is contract address correct?",
    `Then I don't know. Maybe you should try later`,
  ];
  const [dialogStep, setDialogStep] = useState(0);
  const nextStep = () => {
    setDialogStep((prev) => Math.min(prev + 1, errorDialog.length - 1));
  };
  const headerMeta = ["name", "description", "image"];
  const [uri, setURI] = useState<string | undefined>(undefined);
  const { web3, chainId } = useContext(Web3Context);

  const contractState = useQuery(
    ["contractState", contractAddress, chainId],
    async () => {
      const MULTICALL2_CONTRACT_ADDRESS =
        MULTICALL2_CONTRACT_ADDRESSES[
          String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES
        ];
      if (!contractAddress || !MULTICALL2_CONTRACT_ADDRESS) {
        return;
      }
      setDialogStep(0);
      const terminusContract = new web3.eth.Contract(
        terminusAbi,
        contractAddress,
      ) as unknown as MockTerminus;
      const target = contractAddress;
      const callDatas = [];
      callDatas.push(terminusContract.methods.poolBasePrice().encodeABI());
      callDatas.push(terminusContract.methods.paymentToken().encodeABI());
      callDatas.push(terminusContract.methods.contractURI().encodeABI());
      callDatas.push(terminusContract.methods.totalPools().encodeABI());
      callDatas.push(terminusContract.methods.terminusController().encodeABI());
      const queries = callDatas.map((callData) => {
        return {
          target,
          callData,
        };
      });

      const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS);

      return multicallContract.methods
        .tryAggregate(false, queries)
        .call()
        .then((results: { returnData: string; success: boolean }[]) => {
          const parsedResults = results.map(
            (result: { returnData: string; success: boolean }, idx: number) => {
              if (result.returnData === "0x") {
                return undefined;
              }
              let parsed;
              try {
                parsed = web3.utils.hexToNumberString(result.returnData);

                if (idx === 4 || idx === 1) {
                  const adr = "0x" + result.returnData.slice(-40);
                  parsed = web3.utils.toChecksumAddress(adr);
                }
                if (idx === 2) {
                  parsed =
                    "https://" + web3.utils.hexToUtf8(result.returnData).split("https://")[1];
                }
              } catch (e) {
                console.log(e);
                parsed = undefined;
              }
              return String(parsed);
            },
          );
          const data = {
            poolBasePrice: parsedResults[0],
            paymentToken: parsedResults[1],
            contractURI: parsedResults[2],
            totalPools: parsedResults[3],
            controller: parsedResults[4],
          };
          if (data.controller) {
            addRecentAddress(contractAddress, { chainId: String(chainId) });
          }
          setURI(data.contractURI);
          return data;
        });
    },
    {
      ...queryCacheProps,
      // onSuccess: () => {},
    },
  );

  useEffect(() => {
    setContractState(contractState.data);
  }, [contractState.data]);

  useEffect(() => {
    setURI(contractState.data?.contractURI);
  }, []);

  const metadata = useQuery(
    ["link", uri],
    (query: any) => {
      return queryPublic(query.queryKey[1]).then((res: any) => {
        let fields = {};
        if (res.data?.image) {
          fields = { image: res.data.image };
        }
        if (res.data?.name) {
          fields = { ...fields, name: res.data.name };
        }
        addRecentAddress(contractAddress, fields);
        return res.data;
      });
    },
    {
      ...queryCacheProps,
      enabled: !!uri,
    },
  );

  return (
    <>
      {contractState.data && (
        <Flex
          bg="#2d2d2d"
          borderRadius="20px"
          p="30px"
          direction="column"
          gap="20px"
          maxW={"1600px"}
        >
          {metadata.data && (
            <Text fontWeight="700" fontSize="24px">
              {metadata.data.name}
            </Text>
          )}
          <Flex gap="30px">
            {metadata.data && (
              <Flex gap="20px" flex="1 1 0px">
                <Image src={metadata.data.image} alt="contract image" w="140px" h="140px" />
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                  {metadata.data.description}
                </ReactMarkdown>
              </Flex>
            )}
            {contractState.data?.controller && (
              <Flex
                flex="1 1 0px"
                direction="column"
                gap="10px"
                p={5}
                borderRadius="10px"
                bg="#232323"
                maxW="700px"
              >
                <PoolDetailsRow type={"URI"} value={contractState.data.contractURI} />
                <PoolDetailsRow type={"Number of pools"} value={contractState.data.totalPools} />
                <Web3Address
                  address={contractState.data.paymentToken}
                  blockchain={chainByChainId(chainId) ?? ""}
                  entityTag={"tokens"}
                  label={"Payment token"}
                  isTruncated
                  fontSize={"18px"}
                />
                <PoolDetailsRow
                  type={"Pool base price"}
                  value={Number(contractState.data.poolBasePrice).toLocaleString("en-US")}
                />
                <Web3Address
                  address={contractState.data.controller}
                  label={"Contract controller"}
                  entityTag={"accounts"}
                  blockchain={chainByChainId(chainId) ?? ""}
                  isTruncated
                  fontSize={"18px"}
                />
                {metadata.data && (
                  <Accordion allowMultiple>
                    <AccordionItem border="none">
                      <AccordionButton p="0" mb="10px">
                        <Spacer />
                        <Box as="span" flex="1" textAlign="right" pr="10px" fontWeight="700">
                          Metadata
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        {Object.keys(metadata.data)
                          .filter((key) => !headerMeta.includes(key))
                          .map((key) => {
                            return (
                              <PoolDetailsRow
                                key={key}
                                type={key}
                                value={String(metadata.data[key])}
                              />
                            );
                          })}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                )}
              </Flex>
            )}
            {!contractState.data?.controller && (
              <Flex alignItems="center" gap="10px" color="gray.900">
                <Text fontStyle="italic" color="gray.900">
                  {errorDialog[dialogStep]}
                </Text>
                {dialogStep < errorDialog.length - 1 && (
                  <Text
                    cursor="pointer"
                    h="fit-content"
                    p="2px 12px"
                    border="1px solid gray"
                    borderRadius="5px"
                    bg="transparent"
                    onClick={nextStep}
                  >
                    Yes
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default TerminusContractView;
