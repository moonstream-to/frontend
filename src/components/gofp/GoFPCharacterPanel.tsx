import React, { useState } from "react"
import { Flex } from "@chakra-ui/react"

import ActiveCharPanel from "./GoFPActiveCharPanel"
import AddCharPanel from "./GoFPAddCharPanel"

const CharacterPanel = () => {
  const [showActive, setShowActive] = useState<boolean>(true)

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
