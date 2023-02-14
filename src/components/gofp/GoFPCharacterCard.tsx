/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext, useState } from "react"
import { Flex, Box, Text } from "@chakra-ui/react"
import { useDrag } from 'react-dnd'
import { hookCommon, useRouter } from "../../hooks";
import { useQuery } from "react-query";
import Web3Context from "../../contexts/Web3Context/context";
const GardenABI = require('../../web3/abi/GoFPABI.json');
import { GOFPFacet as GardenABIType } from '../../web3/contracts/types/GOFPFacet';



const CharacterCard = ({
  tokenId,
  tokenImage,
  tokenName,
  onSelect,
}: {
  tokenId: number;
  tokenImage: string;
  tokenName: string;
  onSelect: (tokenId: number, selected: boolean) => void;
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const router = useRouter();

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const [sessionId] = useState<number>(router.query["sessionId"]);
  const [gardenContractAddress] = useState<string>(
    router.query["contractId"] || ZERO_ADDRESS
  );

  const web3ctx = useContext(Web3Context);



  const chosenPath = useQuery(['path_for_token', tokenId], async () => {
    if (
      gardenContractAddress == ZERO_ADDRESS ||
      sessionId < 1 ||
      !web3ctx.account
    )
      return [];

    const gardenContract: any = new web3ctx.web3.eth.Contract(
      GardenABI
    ) as any as GardenABIType;
    gardenContract.options.address = gardenContractAddress;

    const res = await gardenContract.methods.getPathChoice(sessionId, tokenId, 1).call()
    return Number(res)
    },
    {
      ...hookCommon,
  }
  )

  const [{ isDragging }, drag] = useDrag({
    item: { name: tokenName, id: tokenId },
    type: "character",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.3 : 1;

  return (
    <Flex
      ref={chosenPath.data ? null : drag}
      flexDirection="column"
      w="80px"
      h="100px"
      mx={2}
      rounded="lg"
      borderWidth={selected ? "4px" : "1px"}
      borderColor="#FFFFFF"
      borderRadius="10px"
      alignItems="center"
      textAlign="center"
      style={{opacity}}
      cursor={chosenPath.data ? 'default' : 'pointer'}
      onClick={() => {
        const newVal = !selected;
        setSelected(newVal);
        onSelect(tokenId, newVal);
      }}
    >
      <Box
        w="63px"
        h="63px"
        borderWidth="1px"
        borderColor="#FFFFFF"
        borderRadius="50%"
        mt="5px"
        backgroundImage={tokenImage}
        backgroundPosition="center"
        backgroundSize="contain"
      />
      <Text userSelect='none' fontSize="xs" px={1}>
        {tokenName || tokenId}
      </Text>
      {!!chosenPath.data && <Text userSelect='none' fontSize="xs" >Path {chosenPath.data}</Text>}
    </Flex>
  );
};

export default CharacterCard;
