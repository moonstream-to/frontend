import React, { useContext } from "react";

import { Flex, Box, SimpleGrid, Text, Button } from "@chakra-ui/react";
import { BsArrowLeftShort } from "react-icons/bs";

import CharacterCard from "./GoFPCharacterCard";
import useGofp from "../../contexts/GoFPContext";
import Web3Context from "../../contexts/Web3Context/context";
import useGofpContract from "../../hooks/useGofpConract";

const AddCharPanel = ({
  setShowActive,
}: {
  // setApproval: UseMutationResult<unknown, unknown, void, unknown>;
  setShowActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const web3ctx = useContext(Web3Context)
  const {selectedTokens, sessionId, gardenContractAddress, } = useGofp()
  const { ownedTokens, stakeTokens, useTokenUris } = useGofpContract({ sessionId, gardenContractAddress, web3ctx })


  const tokenUris = useTokenUris(ownedTokens.data ?? [])  

  return (
    <Box py={6}>
      <Flex alignItems="center" onClick={() => setShowActive(true)}>
        <BsArrowLeftShort size="20px" />
        <Text fontSize="md">Assign Characters</Text>
      </Flex>
      <Text fontSize="lg" fontWeight="bold" pt={4}>
        All Characters
      </Text>
      <Text fontSize="sm" pt={4}>
        Select characters and send them into session to start playing.
      </Text>
      <SimpleGrid columns={3} spacing={4} pt={4}>
        {ownedTokens.data?.map((token) => {
          return (
            <CharacterCard
              key={token}
              tokenId={token}
              uri={tokenUris.data?.get(token) ?? ''}
            />
          );
        })}
      </SimpleGrid>
      <Flex mt={6} flexDirection="column">
        <Button
          w="100%"
          backgroundColor="#F56646"
          rounded="lg"
          onClick={async () => {
            if (ownedTokens.data) {
              await stakeTokens.mutate(
                ownedTokens.data?.filter((tokenId) => selectedTokens.includes(tokenId))
              );
              setShowActive(true);
            }
          }}
        >
          Play
        </Button>
      </Flex>
    </Box>
  );
};

export default AddCharPanel;
