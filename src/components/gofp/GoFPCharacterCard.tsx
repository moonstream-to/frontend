/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext } from "react"

import { Flex, Box, Text } from "@chakra-ui/react"
import { useDrag } from 'react-dnd'

import Web3Context from "../../contexts/Web3Context/context";
import useGofp from "../../contexts/GoFPContext";
import useGofpContract from "../../hooks/useGofpConract";
import useURI from "../../hooks/useLink";


const CharacterCard = ({
  tokenId,
  uri,
}: {
  tokenId: number;
  uri: string,
}) => {

  const web3ctx = useContext(Web3Context);
  const {selectedTokens, toggleTokenSelect, sessionId, gardenContractAddress} = useGofp()

  const { usePath } = useGofpContract({sessionId, gardenContractAddress, web3ctx})
  const path = usePath(tokenId)

  const metadata = useURI({link: uri})


  const [{ isDragging }, drag] = useDrag({
    item: { id: tokenId },
    type: "character",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.3 : 1;

  return (
    <Flex
      ref={path?.data ? null : drag}
      flexDirection="column"
      w="80px"
      h="100px"
      mx={2}
      rounded="lg"
      borderWidth={selectedTokens.includes(tokenId) ? "4px" : "1px"}
      borderColor="#FFFFFF"
      borderRadius="10px"
      alignItems="center"
      textAlign="center"
      style={{opacity}}
      cursor={usePath(tokenId).data ? 'default' : 'pointer'}
      onClick={() => toggleTokenSelect(tokenId)}
    >
      <Box
        w="63px"
        h="63px"
        borderWidth="1px"
        borderColor="#FFFFFF"
        borderRadius="50%"
        mt="5px"
        backgroundImage={metadata.data?.image}
        backgroundPosition="center"
        backgroundSize="contain"
      />
      <Text userSelect='none' fontSize="xs" px={1}>
        {metadata.data?.name || uri || tokenId}
      </Text>
      {!!path.data && <Text userSelect='none' fontSize="xs" >Path {path.data}</Text>}
    </Flex>
  );
};

export default CharacterCard;
