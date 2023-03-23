import React, { useState, useContext, useEffect } from "react"
import { Flex } from "@chakra-ui/react"

import ActiveCharPanel from "./GoFPActiveCharPanel"
import AddCharPanel from "./GoFPAddCharPanel"

import Web3Context from "../../contexts/Web3Context/context"
import useGofp from "../../contexts/GoFPContext"
import useGofpContract from "../../hooks/useGofpConract"

const CharacterPanel = () => {
  const web3ctx = useContext(Web3Context)
  const { sessionId, gardenContractAddress } = useGofp()
  const { stakedTokens } = useGofpContract({ sessionId, gardenContractAddress, web3ctx })
  const [showActive, setShowActive] = useState<boolean>(false)

  useEffect(() => {
    if (stakedTokens.data && stakedTokens.data.length > 0) setShowActive(true)
  }, [stakedTokens.data])

  return (
    <Flex
      backgroundColor="#353535"
      border="4px solid white"
      borderRadius="20px"
      w="420px"
      h="fit-content"
      minH="320px"
      px={4}
      flexDirection="column"
    >
      {true && (
        <>
          {showActive && <ActiveCharPanel setShowActive={setShowActive} />}
          {!showActive && <AddCharPanel setShowActive={setShowActive} />}
        </>
      )}
    </Flex>
  )
}

export default CharacterPanel
