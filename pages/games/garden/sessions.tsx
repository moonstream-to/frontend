/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
// import Layout from '../../src/components/layout'
import http from "../../../src/utils/http";

import { Box, Flex, Text } from "@chakra-ui/react";
import useRouter from "../../../src/hooks/useRouter";
import { hookCommon } from "../../../src/hooks";

import Web3Context from "../../../src/contexts/Web3Context/context";
const GardenABI = require("../../../src/web3/abi/GoFPABI.json");
import { GOFPFacet as GardenABIType } from "../../../src/web3/contracts/types/GOFPFacet";
import SessionCard from "../../../src/components/gofp/GoFPSessionCard";
import { SessionMetadata } from "../../../src/components/gofp/GoFPTypes";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const GoFPSessions = () => {
  const web3ctx = useContext(Web3Context);
  const router = useRouter();

  const [blockchain, setBlockchain] = useState<string>();

  // const [limit] = React.useState<number>(0)
  // const [offset] = React.useState<number>(0)
  // const [currentAccount, setCurrentAccount] = React.useState(ZERO_ADDRESS)
  const [contractAddress, setContractAddress] = React.useState(ZERO_ADDRESS);
  // const [inputValue] = React.useState("")

  useEffect(() => {
    if (router.query["contractId"]) setContractAddress(router.query["contractId"]);
  }, [router.query]);

  useEffect(() => {
    if (router.query["chain"] == "mumbai") setBlockchain("mumbai");
    else setBlockchain("wyrm");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const fetchMetadataUri = async (uri: string) => {
    return http(
      {
        method: "GET",
        url: uri,
      },
      true,
    );
  };

  const getGardenContract = (chain: string, address: string) => {
    let gardenContract: GardenABIType;
    if (chain == "mumbai") {
      gardenContract = new web3ctx.mumbaiClient.eth.Contract(GardenABI) as unknown as GardenABIType;
    } else {
      gardenContract = new web3ctx.wyrmClient.eth.Contract(GardenABI) as unknown as GardenABIType;
    }
    gardenContract.options.address = address;
    return gardenContract;
  };

  const sessionCount = useQuery<number>(
    ["get_session_count", contractAddress, web3ctx.account, blockchain],
    async () => {
      if (contractAddress == ZERO_ADDRESS || contractAddress.trim() == "") return 0;
      if (!blockchain) return 0;

      try {
        const gardenContract: GardenABIType = getGardenContract(blockchain, contractAddress);
        const count = await gardenContract.methods.numSessions().call();
        console.log(`There are ${count} sessions on this contract.`);
        return parseInt(count);
      } catch (e) {
        console.error(e);
        return 0;
      }
    },
    {
      ...hookCommon,
    },
  );

  const sessionData = useQuery<{ sessionId: number; info: unknown; metadata: SessionMetadata }[]>(
    ["get_session_info", contractAddress, sessionCount],
    async () => {
      if (contractAddress == ZERO_ADDRESS || !sessionCount.data) return [];
      if (!blockchain) return [];

      const gardenContract: GardenABIType = getGardenContract(blockchain, contractAddress);

      const results = [];
      for (let i = Math.max(sessionCount.data - 3, 1); i <= sessionCount.data; i++) {
        const info = await gardenContract.methods.getSession(i).call();
        const uri = info[5] + `?timestamp=${new Date().getTime()}`;
        const metadata: SessionMetadata = await fetchMetadataUri(uri).then((res) => {
          return res.data as SessionMetadata;
        });
        results.push({ sessionId: i, info: info, metadata: metadata });
      }
      return results;
    },
    {
      ...hookCommon,
    },
  );

  return (
    <Box
      className="Dashboard"
      px="20px"
      py={["10px", "20px", "30px"]}
      bgColor="#1A1D22"
      maxW="1200px"
    >
      {/* <Input
        placeholder="Contract Address"
        _placeholder={{ opacity: 1, color: "gray.500" }}
        backgroundColor="gray"
        textColor="white"
        ml="20px"
        onChange={(e) => {
          const addy = e.target.value
          if (Web3.utils.isAddress(addy)) {
            router.appendQuery("contractAddress", addy, false, false)
            setContractAddress(addy)
          }
        }}
      /> */}
      <Text fontSize="xl" fontWeight="bold">
        Sessions
      </Text>
      <Flex pt={10} flexDir="row">
        {sessionData.data?.map(
          (
            data: { sessionId: number; info: unknown; metadata: SessionMetadata },
            index: number,
          ) => {
            return (
              <SessionCard
                key={index}
                sessionId={data.sessionId}
                sessionMetadata={data.metadata}
                contractAddress={contractAddress}
              />
            );
          },
        )}
      </Flex>
    </Box>
  );
};

// export async function getStaticProps() {
//   const metatags = {
//     title: "Moonstream player portal: GoFP Sessions",
//     description: "Garden of Forking Paths Sessions",
//   };
//   return {
//     props: { metaTags: { DEFAULT_METATAGS, ...metatags } },
//   };
// }

// GoFPSessions.getLayout = getLayout;
export default GoFPSessions;
