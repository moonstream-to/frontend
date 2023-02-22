/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext, useEffect, useState } from "react"

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

  const { usePath, useGuard, ownedTokens } = useGofpContract({sessionId, gardenContractAddress, web3ctx})
  const path = usePath(tokenId)
  const guard = useGuard(tokenId)
  const [status, setStatus] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (guard.data && ownedTokens.data?.includes(tokenId)) {
      setStatus(guard.data ? 'Already played' : 'Available')
    } else {
      setStatus(path.data ? `Assigned to path ${path.data}` : 'Choose path')
    }
  }, [path.data, guard.data, tokenId, ownedTokens.data])

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
      w="90px"
      h="130px"
      mx={1}
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
      <Text userSelect='none' px={1} fontSize="12px" pt={1}>
        {metadata.data?.name || tokenId}
      </Text>
      {status && <Text 
        userSelect='none' 
        fontSize="8px" 
        pt={1}
        px={1}
        textColor={status === 'Already played' ? "#EE8686" : undefined}
      >
        {status}
      </Text>}
    </Flex>
  );
};

export default CharacterCard;
