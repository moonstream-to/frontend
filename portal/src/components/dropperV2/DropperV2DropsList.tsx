/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Flex, Select, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import queryCacheProps from "../../hooks/hookCommon";
const multicallABI = require("../../web3/abi/Multicall2.json");
import { MAX_INT, MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";
const dropperAbi = require("../../web3/abi/DropperV2.json");
const terminusAbi = require("../../web3/abi/MockTerminus.json");
import DropperV2ClaimsListItem from "./DropperV2ClaimsListItem";

const DropperV2DropsList = ({
  contractAddress,
  selected,
  setSelected,
  onChange,
  filter,
  queryDropId,
  adminOnly,
}: {
  contractAddress: string;
  selected: number;
  setSelected: (arg0: number) => void;
  onChange: (id: string, metadata: unknown) => void;
  filter: string;
  queryDropId: number | undefined;
  adminOnly: boolean;
}) => {
  const { chainId, web3 } = useContext(Web3Context);
  const web3ctx = useContext(Web3Context);
  const [statusFilter, setStatusFilter] = useState("All");

  const dropsList = useQuery(
    ["dropsList", contractAddress, chainId, queryDropId],
    async () => {
      const MULTICALL2_CONTRACT_ADDRESS =
        MULTICALL2_CONTRACT_ADDRESSES[
          String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES
        ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dropperContract = new web3.eth.Contract(dropperAbi) as any;
      dropperContract.options.address = contractAddress ?? "";

      const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS);

      const uriQueries = [];
      const dropAuthQueries = [];
      const dropStatusQueries = [];

      const LIMIT = Number(MAX_INT);
      let totalDrops: string | number;
      try {
        totalDrops = await dropperContract.methods.numDrops().call();
      } catch (e) {
        console.log(e);
        totalDrops = 0;
      }
      for (let i = 1; i <= Math.min(LIMIT, Number(totalDrops)); i += 1) {
        uriQueries.push({
          target: contractAddress,
          callData: dropperContract.methods.dropUri(i).encodeABI(),
        });
      }

      for (let i = 1; i <= Math.min(LIMIT, Number(totalDrops)); i += 1) {
        dropAuthQueries.push({
          target: contractAddress,
          callData: dropperContract.methods.getDropAuthorization(i).encodeABI(),
        });
      }
      for (let i = 1; i <= Math.min(LIMIT, Number(totalDrops)); i += 1) {
        dropStatusQueries.push({
          target: contractAddress,
          callData: dropperContract.methods.dropStatus(i).encodeABI(),
        });
      }

      return multicallContract.methods
        .tryAggregate(false, uriQueries.concat(dropAuthQueries).concat(dropStatusQueries))
        .call()
        .then((results: string[]) => {
          const parsedResults = [];
          let parsedUri;
          for (let i = 0; i < Number(totalDrops); i += 1) {
            try {
              parsedUri = web3.utils.hexToUtf8(results[i][1]).split("https://")[1];
              if (!parsedUri) {
                throw "not an address";
              }
              parsedUri = "https://" + parsedUri;
            } catch (e) {
              console.log(e);
              parsedUri = undefined;
            }
            const { poolId, terminusAddress } = web3.eth.abi.decodeParameter(
              { tuple: { terminusAddress: "address", poolId: "uint256" } },
              results[i + Number(totalDrops)][1],
            );
            const active = web3.eth.abi.decodeParameter(
              "bool",
              results[i + Number(totalDrops) * 2][1],
            );
            parsedResults.push({ uri: parsedUri, id: i + 1, poolId, terminusAddress, active });
          }
          return parsedResults;
        })
        .then(async (parsedResults: any) => {
          const terminusContract = new web3.eth.Contract(terminusAbi) as any;

          const balanceQueries = parsedResults.map((drop: any) => {
            terminusContract.options.address = drop.terminusAddress;
            return {
              target: drop.terminusAddress,
              callData: terminusContract.methods
                .balanceOf(web3ctx.account, drop.poolId)
                .encodeABI(),
            };
          });
          const balances = await multicallContract.methods
            .tryAggregate(false, balanceQueries)
            .call()
            .then((results: any[]) =>
              results.map((result: any) => web3.eth.abi.decodeParameter("uint256", result[1])),
            );
          return parsedResults
            .map((drop: any, idx: number) => {
              return { ...drop, admin: balances[idx] > 0 };
            })
            .reverse();
        });
    },
    {
      ...queryCacheProps,
      enabled:
        !!contractAddress &&
        !!MULTICALL2_CONTRACT_ADDRESSES[
          String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES
        ],
      // onSuccess: () => {}, //TODO
    },
  );

  useEffect(() => {
    if (selected < 1 && dropsList.data) {
      setSelected(dropsList.data.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropsList.data, selected]);

  useEffect(() => {
    dropsList.refetch();
  }, [web3ctx.account]);

  return (
    <>
      {dropsList.data && (
        <Flex direction="column" gap="15px" h="100%" overflowY="auto">
          <Flex alignItems="center" fontSize="18px">
            <Text>Drop state:</Text>
            <Select
              fontSize="18px"
              w="fit-content"
              border="none"
              _focus={{ border: "none" }}
              _hover={{ border: "none" }}
              _active={{ border: "none" }}
              _focusVisible={{ border: "none" }}
              textAlign="center"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Flex>
          {dropsList.isLoading &&
            Array.from(Array(5)).map((_, idx) => (
              <Flex key={idx} gap="15px">
                <SkeletonCircle minH="27px" startColor="#2d2d2d" endColor="#222222" />
                <Skeleton bg="red" minH="27px" w="250px" startColor="#2d2d2d" endColor="#222222" />
              </Flex>
            ))}
          {dropsList.data
            .filter((drop: { admin: boolean }) => !adminOnly || drop.admin)
            .map((drop: { uri: string; id: number }) => (
              <DropperV2ClaimsListItem
                key={drop.id}
                address={contractAddress}
                claimId={String(drop.id)}
                selected={drop.id === selected}
                inQuery={drop.id === queryDropId}
                uri={drop.uri}
                onChange={onChange}
                filter={filter}
                statusFilter={statusFilter}
                dropState={drop}
              />
            ))}
        </Flex>
      )}
    </>
  );
};

export default DropperV2DropsList;
