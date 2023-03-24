import React, { useContext, useEffect, useState } from "react"
import { Flex, Image, Text, Box, Center, Button, Spacer } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Web3 from "web3/types"

import { SessionMetadata } from "./GoFPTypes"
import useGofp from "../../contexts/GoFPContext"
import Web3Context from "../../contexts/Web3Context/context"
import useGofpContract from "../../hooks/useGofpConract"
import TextWithPopup from "../TextWithPopup"

const SessionCard = ({
  sessionId,
  sessionMetadata,
  contractAddress,
}: {
  sessionId: number
  sessionMetadata: SessionMetadata
  contractAddress: string
}) => {
  const correctPathColor = "#3BB563"
  const incorrectPathColor = "#E85858"
  const undecidedPathColor = "#4C4C4C"

  const router = useRouter()
  const imageUrl = sessionMetadata.imageUrl
  const defaultImageUrl =
    "https://s3.amazonaws.com/static.simiotics.com/moonstream/assets/minigames-card.png"
  const calculatedImage = imageUrl && imageUrl.trim() != "" ? imageUrl : defaultImageUrl

  return (
    <Flex
      backgroundColor="#353535"
      // border="4px solid white"
      borderRadius="20px"
      w="220px"
      h="440px"
      mx={4}
      flexDir="column"
    >
      <Image
        w="180px"
        h="180px"
        ml="20px"
        mt="20px"
        alt={`Image for session ${sessionId}`}
        src={calculatedImage}
      ></Image>
      <Box px="20px">
        <TextWithPopup
          text={sessionMetadata.lore}
          image={calculatedImage}
          title={sessionMetadata.title}
          shortCharCount={150}
        />
      </Box>
      <Spacer />
      <Button
        mx="20px"
        mb="20px"
        w="180px"
        backgroundColor="#F56646"
        textColor="white"
        onClick={() => {
          router.push(`/games/garden/?contractId=${contractAddress}&&sessionId=${sessionId}`)
        }}
      >
        Play
      </Button>
    </Flex>
  )
}

export default SessionCard
