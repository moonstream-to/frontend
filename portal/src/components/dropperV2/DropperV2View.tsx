/* eslint-disable @typescript-eslint/no-var-requires */
import { useRouter } from "next/router";

import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Box, Button, Center, Flex, Icon, Input, Text, useToast } from "@chakra-ui/react";

import Web3Context from "../../../src/contexts/Web3Context/context";
import useDropperContract from "../../../src/hooks/useDropper.sol";
import useRecentAddresses from "../../../src/hooks/useRecentAddresses";
import ContractRow from "../../../src/components/ContractRow";
import DropperV2ContractView from "./DropperV2ContractView";
import DropperV2DropView from "./DropperV2DropView";
import DropperV2DropsListView from "./DropperV2DropsListView";
import http from "../../utils/httpMoonstream";
import DropperV2ContractCard from "./DropperV2ContractCard";
import AddEntityButton from "../entity/AddEntityButton";
import { chainByChainId } from "../../contexts/Web3Context";
import { Entity } from "../../types";
import { AiOutlineSave } from "react-icons/ai";
import { useJournal } from "../../hooks/useJournal";

const DropperV2View = () => {
  const router = useRouter();
  const contractAddress =
    typeof router.query.contractAddress === "string" ? router.query.contractAddress : "";

  const web3ctx = useContext(Web3Context);

  const { contractState } = useDropperContract({ dropperAddress: contractAddress, ctx: web3ctx });
  const [selected, setSelected] = useState(-1);
  const [totalDrops, setTotalDrops] = useState(0);
  const [claimMetadata, setClaimMetadata] = useState<unknown>({});
  const dropperContracts = useJournal({ tags: ["dropperContracts"] });

  const [isContractRegistered, setIsContractRegistered] = useState(false);

  const handleClick = (dropId: string, metadata: unknown) => {
    setSelected(Number(dropId));
    setClaimMetadata(metadata);
  };
  const [nextValue, setNextValue] = useState(contractAddress);

  const toast = useToast();
  const { recentAddresses, addRecentAddress } = useRecentAddresses("dropper");

  useEffect(() => {
    if (router.query.dropId) {
      setSelected(Number(router.query.dropId));
    }
  }, [router.query.dropId]);

  useEffect(() => {
    if (contractAddress) {
      setNextValue(contractAddress);
    }
    setClaimMetadata({});
    if (!router.query.dropId) {
      setSelected(-1);
    }
  }, [contractAddress]);

  const { chainId, web3 } = useContext(Web3Context);

  const getContracts = () => {
    return http({
      method: "GET",
      url: `https://engineapi.moonstream.to/metatx/contracts`,
    }).then((res) => res.data);
  };

  const contractsQuery = useQuery(["metatxContracts1"], getContracts, {
    onError: (e) => {
      console.log(e);
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (nextValue && web3.utils.isAddress(nextValue)) {
      handleSubmit();
    }
    queryClient.invalidateQueries("claimAdmin");
    queryClient.invalidateQueries("terminusAddresses");
    queryClient.invalidateQueries("claimants");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, web3ctx.account]);

  const handleSubmit = () => {
    if (web3.utils.isAddress(nextValue)) {
      setClaimMetadata({});
      router.push({
        pathname: "/portal/dropperV2",
        query: {
          contractAddress: nextValue,
          dropId: router.query.dropId,
        },
      });
    } else {
      toast({
        render: () => (
          <Box borderRadius="5px" textAlign="center" color="black" p={1} bg="red.600">
            Invalid address
          </Box>
        ),
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Center>
      <Flex gap="30px" direction="column" px="7%" py="30px" color="white">
        <Flex gap="20px">
          <Input
            onKeyDown={handleKeyDown}
            w="50ch"
            placeholder="dropper contract address"
            type="text"
            value={nextValue}
            onChange={(e) => setNextValue(e.target.value)}
            spellCheck="false"
          />
          <Button
            bg="gray.0"
            fontWeight="400"
            fontSize="18px"
            color="#2d2d2d"
            onClick={handleSubmit}
          >
            Show
          </Button>
          <AddEntityButton
            address={nextValue}
            tags={["dropperContracts"]}
            blockchain={String(web3ctx.chainId)}
            isDisabled={
              !web3.utils.isAddress(nextValue) ||
              dropperContracts.data?.entities.some((e: Entity) => e.address === nextValue)
            }
          >
            <Icon as={AiOutlineSave} h={5} w={5} />
          </AddEntityButton>
        </Flex>
        {contractAddress && (
          <>
            <DropperV2ContractView
              address={contractAddress}
              addRecentAddress={addRecentAddress}
              isContractRegistered={isContractRegistered}
              setIsContractRegistered={setIsContractRegistered}
            />
            <Flex gap="40px" position="relative">
              {contractState.data && (
                <>
                  <DropperV2DropsListView
                    contractAddress={contractAddress}
                    contractState={contractState}
                    onChange={handleClick}
                    selected={selected}
                    setSelected={setSelected}
                    setTotalDrops={setTotalDrops}
                  />
                  <Flex minW="400px" />
                </>
              )}
              {contractState.data && (
                <DropperV2DropView
                  address={contractAddress}
                  dropId={selected}
                  metadata={claimMetadata}
                  isContractRegistered={isContractRegistered}
                  totalDrops={totalDrops}
                />
              )}
            </Flex>
          </>
        )}
        {!contractAddress && dropperContracts.data?.entities && (
          <Flex direction="column" gap="20px" bg="#2d2d2d" borderRadius="10px" p="20px">
            <Text>Dropper Contracts</Text>
            {dropperContracts.data.entities.map((e: Entity, idx: number) => (
              <ContractRow
                type="dropper"
                key={idx}
                address={e.address}
                chainId={Number(e.blockchain)}
                image={e.secondary_fields?.image ?? ""}
                onClick={() => {
                  if (Number(e.blockchain) !== chainId) {
                    const chainName = chainByChainId(Number(e.blockchain));
                    if (chainName) {
                      web3ctx.changeChain(chainName);
                    }
                  }
                  router.push({
                    pathname: `/portal/dropperV2`,
                    query: {
                      contractAddress: e.address,
                    },
                  });
                }}
              />
            ))}
          </Flex>
        )}
        {contractsQuery.data && !contractAddress && <Text variant="title2">My contracts</Text>}
        {contractsQuery.data && !contractAddress && (
          <Flex gap="35px">
            {contractsQuery.data.map((c: any) => (
              <DropperV2ContractCard
                key={c.id}
                title={c.title}
                address={c.address}
                uri={c.image_uri}
                id={c.id}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Center>
  );
};

export default DropperV2View;
