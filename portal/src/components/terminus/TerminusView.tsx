/* eslint-disable @typescript-eslint/no-var-requires */
import { useRouter } from "next/router";

import { useContext, useEffect, useState } from "react";
import { Box, Button, Center, Flex, Icon, Input, Text, useToast } from "@chakra-ui/react";

import TerminusPoolsListView from "./TerminusPoolsListView";
import TerminusPoolView from "./TerminusPoolView";
import TerminusContractView from "./TerminusContractView";
import Web3Context from "../../contexts/Web3Context/context";
import ContractRow from "../ContractRow";
import useTerminus from "../../contexts/TerminusContext";
import useRecentAddresses from "../../hooks/useRecentAddresses";
import { useJournal } from "../../hooks/useJournal";
import { AiOutlineSave } from "react-icons/ai";
import { chainByChainId } from "../../contexts/Web3Context";
import { supportedChains } from "../../types/Moonstream";
import { Entity } from "../../types";
import AddEntityButton from "../entity/AddEntityButton";
import useLink from "../../hooks/useLink";

const TerminusView = () => {
  const {
    contractAddress,
    setContractAddress,
    selectPool,
    setSelectedPoolMetadata,
    contractState,
  } = useTerminus();
  const router = useRouter();

  const [addressInputValue, setAddressInputValue] = useState(contractAddress);

  const { addRecentAddress } = useRecentAddresses("terminus");
  const terminusContracts = useJournal({ tags: ["terminusContracts"] });

  const toast = useToast();

  useEffect(() => {
    if (!router.query.poolId) {
      selectPool(1);
    } else {
      selectPool(Number(router.query.poolId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.contractAddress, router.query.poolId]);

  const { chainId, web3, changeChain } = useContext(Web3Context);

  useEffect(() => {
    setContractAddress(
      typeof router.query.contractAddress === "string" ? router.query.contractAddress : "",
    );
    setSelectedPoolMetadata({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.contractAddress, chainId]);

  useEffect(() => {
    if (contractAddress) {
      setAddressInputValue(contractAddress);
    }
    setSelectedPoolMetadata({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress]);

  const handleSubmit = () => {
    if (web3.utils.isAddress(addressInputValue)) {
      setSelectedPoolMetadata({});
      router.push({
        pathname: "/terminus",
        query: {
          contractAddress: addressInputValue,
          poolId: router.query.poolId,
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

  const metadata = useLink({ link: contractState?.contractURI });

  const isSaveDisabled = () =>
    !web3.utils.isAddress(addressInputValue) ||
    terminusContracts.data?.entities.some((e: Entity) => e.address === addressInputValue);

  const hintForSaveButton = () => {
    const title = terminusContracts.data?.entities.find(
      (e: Entity) => e.address === addressInputValue,
    )?.title;
    return title ? `Already saved as ${title}` : "Save";
  };

  return (
    <Center>
      <Flex gap="30px" direction="column" px="7%" py="30px" color="white">
        <Flex gap="20px" alignItems={"center"}>
          <Input
            onKeyDown={handleKeyDown}
            w="50ch"
            placeholder="terminus contract address"
            type="text"
            value={addressInputValue}
            onChange={(e) => setAddressInputValue(e.target.value.trim())}
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
            title={metadata.data?.name}
            hint={hintForSaveButton()}
            address={addressInputValue}
            tags={["terminusContracts"]}
            blockchain={chainByChainId(chainId) ?? ""}
            secondaryFields={metadata.data}
            isDisabled={isSaveDisabled()}
          >
            <Icon as={AiOutlineSave} h={5} w={5} />
          </AddEntityButton>
        </Flex>
        {contractAddress && (
          <>
            <TerminusContractView addRecentAddress={addRecentAddress} />
            <Flex gap="40px" maxH="700px">
              <TerminusPoolsListView />
              <TerminusPoolView />
            </Flex>
          </>
        )}
        {!contractAddress && terminusContracts.data?.entities && (
          <Flex direction="column" gap="20px" bg="#2d2d2d" borderRadius="10px" p="20px">
            <Text>Terminus Contracts</Text>
            {terminusContracts.data.entities.map((e: Entity, idx: number) => (
              <ContractRow
                type="terminus"
                key={idx}
                address={e.address}
                chain={e.blockchain}
                name={e.secondary_fields?.title ?? e.title}
                image={e.secondary_fields?.image ?? ""}
                onClick={() => {
                  if (e.blockchain !== chainByChainId(chainId)) {
                    changeChain(e.blockchain as supportedChains);
                  }
                  router.push({
                    pathname: `/portal/terminus`,
                    query: {
                      contractAddress: e.address,
                    },
                  });
                }}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Center>
  );
};

export default TerminusView;
