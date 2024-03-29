/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Flex } from "@chakra-ui/react";

import Spinner from "../Spinner/Spinner";
import Web3Context from "../../contexts/Web3Context/context";
import TerminusPoolsListItem from "./TerminusPoolsListItem";
import queryCacheProps from "../../hooks/hookCommon";
const terminusAbi = require("../../web3/abi/MockTerminus.json");
const multicallABI = require("../../web3/abi/Multicall2.json");
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import { MAX_INT, MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";
import useTermiminus from "../../contexts/TerminusContext";

const TerminusPoolsList = () => {
  const { chainId, web3 } = useContext(Web3Context);
  const {
    contractAddress,
    queryPoolId,
    setIsNewPoolCreated,
    isNewPoolCreated,
    selectPool,
    selectedPool,
  } = useTermiminus();

  const [isFirstFetch, setIsFirstFetch] = useState(true);

  useEffect(() => {
    setIsFirstFetch(true);
  }, [contractAddress, chainId]);

  const poolsList = useQuery(
    ["poolsList", contractAddress, chainId, queryPoolId],
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

      const uriQueries = [];

      const LIMIT = Number(MAX_INT);
      let totalPools;
      try {
        totalPools = await terminusContract.methods.totalPools().call();
      } catch (e: any) {
        return new Promise((_, reject) => {
          reject(new Error(e?.message));
        });
      }

      for (let i = 1; i <= Math.min(LIMIT, Number(totalPools)); i += 1) {
        uriQueries.push({
          target: contractAddress,
          callData: terminusContract.methods.uri(i).encodeABI(),
        });
      }

      return multicallContract.methods
        .tryAggregate(false, uriQueries)
        .call()
        .then((results: string[]) => {
          return results.map((result) => {
            let parsed;
            try {
              parsed = web3.utils.hexToUtf8(result[1]).split("https://")[1];
              if (!parsed) {
                throw "not an address";
              }
              parsed = "https://" + parsed;
            } catch (e) {
              console.log(e);
              parsed = undefined;
            }
            return parsed;
          });
        })
        .then((parsedResults: string[]) => {
          return parsedResults.reverse();
        });
    },
    {
      ...queryCacheProps,
      onSuccess: (data: any) => {
        if (data) {
          if (isNewPoolCreated) {
            setIsNewPoolCreated(false);
            selectPool(data.length);
            setTimeout(() => {
              const element = document.getElementById(`pool-${data.length}`);
              element?.scrollIntoView(true);
              const poolView = document.getElementById("poolView");
              poolView?.scrollIntoView();
            }, 500);
          }
          if (isFirstFetch) {
            setIsFirstFetch(false);
            if (!queryPoolId) {
              selectPool(data.length);
            }
          }
          if (selectedPool < 1 || selectedPool > data.length) {
            selectPool(data.length);
          }
        }
      },
    },
  );

  if (!poolsList.data) {
    return <Spinner />;
  }

  return (
    <Flex direction="column" gap="15px" h="100%" overflowY="auto">
      {poolsList.data.map((uri: string, idx: number) => (
        <TerminusPoolsListItem key={idx} poolId={poolsList.data.length - idx} uri={uri} />
      ))}
    </Flex>
  );
};

export default TerminusPoolsList;
