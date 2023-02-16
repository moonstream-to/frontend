import React, { useContext } from "react";

import { Flex, Center, Text, Image } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import useGofp from "../../contexts/GoFPContext";
import useGofpContract from "../../hooks/useGofpConract";

const MetadataPanel = () => {
  const web3ctx = useContext(Web3Context);
  const { sessionId, selectedStage, gardenContractAddress } = useGofp()
  const { sessionMetadata } = useGofpContract({
    sessionId, 
    gardenContractAddress,
    web3ctx,
  })

  const stage = sessionMetadata.data?.stages[selectedStage - 1];


  return (
    <>
    {stage && (
    <Flex
      backgroundColor="#353535"
      border="4px solid white"
      borderRadius="20px"
      w="400px"
      px={4}
      flexDirection="column"
    >
      <Text fontSize="md" fontWeight="semibold" pt={6}>
        Stage {selectedStage}
      </Text>
      <Text fontSize="xl" fontWeight="bold" pt={4}>
        {stage.title}
      </Text>
      <Flex borderWidth="2px" borderColor="#BFBFBF" borderRadius="10px" mt={6}>
        <Text p={2}>{stage.lore}</Text>
      </Flex>
      {stage.imageUrl.length > 0 && (
        <Center>
          <Image
            alt={"Stage " + selectedStage}
            w="300px"
            h="300px"
            src={stage.imageUrl}
            pt={6}
          />
        </Center>
      )}
      <Flex flexDirection="column" mb={10}>
        {stage.paths.map((path, pathIdx) => {
          return (
            <Flex
              key={pathIdx}
              borderWidth="2px"
              borderColor="#BFBFBF"
              borderRadius="10px"
              mt={6}
              flexDirection="column"
            >
              <Text fontWeight="semibold" p={2}>
                Path {pathIdx + 1} - {path.title}
              </Text>
              <Text p={2}>{path.lore}</Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
    )}
    </>
  );
};

export default MetadataPanel;
