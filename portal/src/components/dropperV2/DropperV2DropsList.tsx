/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Flex, Select, Skeleton, SkeletonCircle, Spinner, Text } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import queryCacheProps from "../../hooks/hookCommon";
const multicallABI = require("../web3/abi/Multicall2.json");
import { MAX_INT, MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";
const dropperAbi = require("../web3/abi/DropperV2.json");
// import { Dropper } from "../web3/contracts/types/Dropper";
import DropperClaimsListItem from "../DropperClaimsListItem";
import useDrops from "../../hooks/useDrops";

const DropperV2DropsList = ({
  contractAddress,
  selected,
  setSelected,
  onChange,
  filter,
  queryClaimId,
}: {
  contractAddress: string;
  selected: number;
  setSelected: (arg0: number) => void;
  onChange: (id: string, metadata: unknown) => void;
  filter: string;
  queryClaimId: number | undefined;
}) => {
  const { chainId, web3 } = useContext(Web3Context);
  const web3ctx = useContext(Web3Context);
  const [statusFilter, setStatusFilter] = useState("All");

  const { adminClaims } = useDrops({ ctx: web3ctx, dropperAddress: contractAddress });

  const claimsList = useQuery(
    ["claimsList", contractAddress, chainId, queryClaimId],
    async () => {
      const MULTICALL2_CONTRACT_ADDRESS =
        MULTICALL2_CONTRACT_ADDRESSES[
          String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES
        ];
      const dropperContract = new web3.eth.Contract(dropperAbi) as any;
      dropperContract.options.address = contractAddress ?? "";

      const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS);

      const uriQueries = [];

      const LIMIT = Number(MAX_INT);
      let totalClaims;
      try {
        totalClaims = await dropperContract.methods.numDrops().call();
      } catch (e) {
        console.log(e);
        totalClaims = 0;
      }
      for (let i = 1; i <= Math.min(LIMIT, Number(totalClaims)); i += 1) {
        uriQueries.push({
          target: contractAddress,
          callData: dropperContract.methods.dropUri(i).encodeABI(),
        });
      }

      return multicallContract.methods
        .tryAggregate(false, uriQueries)
        .call()
        .then((results: string[]) => {
          return results.map((result, idx) => {
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
            return { uri: parsed, id: idx + 1 };
          });
        })
        .then((parsedResults: string[]) => {
          return parsedResults.reverse();
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
    if (selected < 1 && claimsList.data) {
      setSelected(claimsList.data.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimsList.data, selected]);

  return (
    <>
      {claimsList.data && (
        <Flex direction="column" gap="15px" h="100%" overflowY="auto">
          {adminClaims.isLoading && <Spinner />}
          {adminClaims.data?.length > 0 && (
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
          )}
          {claimsList.isLoading &&
            Array.from(Array(5)).map((_, idx) => (
              <Flex key={idx} gap="15px">
                <SkeletonCircle minH="27px" startColor="#2d2d2d" endColor="#222222" />
                <Skeleton bg="red" minH="27px" w="250px" startColor="#2d2d2d" endColor="#222222" />
              </Flex>
            ))}
          {claimsList.data.map((claim: { uri: string; id: number }) => (
            <DropperClaimsListItem
              key={claim.id}
              address={contractAddress}
              claimId={String(claim.id)}
              selected={claim.id === selected}
              inQuery={claim.id === queryClaimId}
              uri={claim.uri}
              onChange={onChange}
              filter={filter}
              statusFilter={statusFilter}
              dropState={adminClaims.data?.find(
                (dbClaim: { drop_number: number }) => dbClaim.drop_number === claim.id,
              )}
            />
          ))}
        </Flex>
      )}
    </>
  );
};

export default DropperV2DropsList;
