/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react"
import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"

import Web3Context from "../contexts/Web3Context/context"
import { useRouter } from "next/router"
import { MAX_INT } from "../constants"
import DropperClaimsList from "./DropperClaimsList"

const DropperClaimsListView = ({
  contractAddress,
  selected,
  setSelected,
  onChange,
  contractState,
}: {
  contractAddress: string
  selected: number
  setSelected: (arg0: number) => void
  onChange: (id: string, metadata: unknown) => void
  contractState: any
}) => {
  const router = useRouter()

  const [queryClaimId, setQueryClaimId] = useState<number | undefined>(undefined)
  const [filter, setFilter] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const web3ctx = useContext(Web3Context)
  const [newClaimProps, setNewClaimProps] = useState<{
    capacity: string | undefined
    isTransferable: boolean
    isBurnable: boolean
  }>({ capacity: undefined, isTransferable: true, isBurnable: true })

  useEffect(() => {
    setQueryClaimId(
      typeof router.query.claimId === "string" ? Number(router.query.claimId) : undefined,
    )
  }, [router.query.claimId])

  return (
    <Flex
      direction="column"
      bg="#2d2d2d"
      borderRadius="20px"
      gap="30px"
      p="30px"
      w="400px"
      maxH="700px"
      color="white"
    >
      <Text fontWeight="700" fontSize="24px">
        claims
      </Text>
      <Input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="search"
        borderRadius="10px"
        p="8px 15px"
      />

      <DropperClaimsList
        contractAddress={contractAddress}
        onChange={onChange}
        setSelected={setSelected}
        selected={selected}
        filter={filter}
        queryClaimId={queryClaimId ?? undefined}
      />

      {contractState && contractState.owner === web3ctx.account && (
        <Button
          width="100%"
          bg="gray.0"
          fontWeight="700"
          fontSize="20px"
          color="#2d2d2d"
          onClick={onOpen}
        >
          + Add new
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#181818" color="white" border="1px solid white">
          <ModalHeader>New pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={3}>
              <Input
                onChange={(e) =>
                  setNewClaimProps((prev) => {
                    return { ...prev, capacity: e.target.value }
                  })
                }
                placeholder="capacity"
                type="number"
                value={newClaimProps.capacity}
                mb={4}
              />
              <Button
                colorScheme="purple"
                onClick={() => {
                  setNewClaimProps((prev) => {
                    return { ...prev, capacity: MAX_INT }
                  })
                }}
              >
                MAX_INT
              </Button>
            </Flex>
            <Checkbox
              colorScheme="white"
              mr={3}
              onChange={(e) =>
                setNewClaimProps((prev) => {
                  return { ...prev, isBurnable: e.target.checked }
                })
              }
              isChecked={newClaimProps.isBurnable}
            >
              Burnable
            </Checkbox>
            <Checkbox
              colorScheme="white"
              onChange={(e) =>
                setNewClaimProps((prevState) => {
                  return { ...prevState, isTransferable: e.target.checked }
                })
              }
              isChecked={newClaimProps.isTransferable}
            >
              Transferable
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="whiteAlpha" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                onClose()
              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default DropperClaimsListView
