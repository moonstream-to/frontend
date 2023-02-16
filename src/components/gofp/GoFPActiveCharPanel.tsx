import React, { useContext } from "react";

import {
  Flex,
  Box,
  SimpleGrid,
  Text,
  Button,
  Spacer,
  Center,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";

import CharacterCard from "./GoFPCharacterCard";
import useGofp from "../../contexts/GoFPContext";
import useGofpContract from "../../hooks/useGofpConract";
import Web3Context from "../../contexts/Web3Context/context";


const ActiveCharPanel = ({
  setShowActive,
}: {
  setShowActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { selectedPath, selectedTokens, gardenContractAddress, sessionId } = useGofp()
  const web3ctx = useContext(Web3Context)

  const { unstakeTokens, useTokenUris, stakedTokens, choosePath } = useGofpContract({sessionId, gardenContractAddress, web3ctx})
  const tokenUris = useTokenUris(stakedTokens.data ?? [])

  return (
    <Box py={6}>
      <Flex>
        <Text fontSize="lg" fontWeight="bold">
          Assign Characters
        </Text>
        <Spacer />
        <Flex alignItems="center" onClick={() => setShowActive(false)}>
          <AiOutlinePlus size="10px" />
          <Text fontSize="sm">Add More</Text>
        </Flex>
      </Flex>
      <SimpleGrid columns={3} spacing={5} pt={4}>
        {stakedTokens.data?.map((token) => {
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
          width="100%"
          backgroundColor="transparent"
          borderWidth="1px"
          borderColor="#BFBFBF"
          borderRadius="18px"
          textColor="#BFBFBF"
          onClick={() => choosePath.mutate({path: selectedPath, tokenIds: selectedTokens})}
        >
          Choose Path {selectedPath}
        </Button>
        <Center>
          <Text>or&nbsp;</Text>
          <Text
            color="#EE8686"
            cursor='pointer'
            onClick={() =>
              unstakeTokens.mutate(
                stakedTokens.data?.filter(
                  (tokenId) => selectedTokens.includes(tokenId)
                ) ?? []
              )
            }
          >
            remove characters from session
          </Text>
        </Center>
      </Flex>
    </Box>
  );
};

export default ActiveCharPanel;
