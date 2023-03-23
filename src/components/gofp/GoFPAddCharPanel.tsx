import React, { useContext } from "react"

import {
  Flex,
  Box,
  SimpleGrid,
  Text,
  Button,
  Center,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react"
import { BsArrowLeftShort } from "react-icons/bs"

import CharacterCard from "./GoFPCharacterCard"
import useGofp from "../../contexts/GoFPContext"
import Web3Context from "../../contexts/Web3Context/context"
import useGofpContract from "../../hooks/useGofpConract"

const AddCharPanel = ({
  setShowActive,
}: {
  setShowActive: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const web3ctx = useContext(Web3Context)

  const { selectedTokens, sessionId, gardenContractAddress } = useGofp()
  const { ownedTokens, stakeTokens, setApproval, useTokenUris, useApprovalForAll } =
    useGofpContract({ sessionId, gardenContractAddress, web3ctx })
  const tokenUris = useTokenUris(ownedTokens.data ?? [])
  const isApproved = useApprovalForAll()

  const { isOpen, onOpen, onClose } = useDisclosure()

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
            <CharacterCard key={token} tokenId={token} uri={tokenUris.data?.get(token) ?? ""} />
          )
        })}
      </SimpleGrid>
      <Flex mt={6} flexDirection="column">
        <Button
          variant="plainOrange"
          w="100%"
          onClick={async () => {
            if (isApproved?.data && ownedTokens.data) {
              await stakeTokens.mutate(
                ownedTokens.data?.filter((tokenId) => selectedTokens.includes(tokenId)),
              )
              setShowActive(true)
            } else {
              onOpen()
            }
          }}
        >
          Play
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="#1A1D22" border="1px solid white" borderRadius="20px" textColor="white">
            <ModalHeader>Approve Contract</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                In order to play Great Wyrm and other Garden of Forking Paths games transferring
                characters to the game contract is required. Metamask will ask to approve the
                transfer. The confirmation is given once for all sessions.
              </Text>
              <br />
              <Text>
                You can unstake and return any of your characters at any time. You will be able to
                stake more characters before the first stage will be finished.
              </Text>
            </ModalBody>

            <ModalFooter>
              <Flex>
                <Button bgColor="#4D4D4D" m={2} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="plainOrange"
                  m={2}
                  onClick={async () => {
                    setApproval.mutate()
                    onClose()
                  }}
                >
                  Approve
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  )
}

export default AddCharPanel
