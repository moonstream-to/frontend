/* eslint-disable @typescript-eslint/no-var-requires */
import { useRouter } from "next/router"

import { useContext, useEffect, useState } from "react"
import { Box, Button, Center, Flex, Input, Text, useToast } from "@chakra-ui/react"

import TerminusPoolsListView from "./TerminusPoolsListView"
import TerminusPoolView from "./TerminusPoolView"
import TerminusContractView from "./TerminusContractView"
import Web3Context from "../../contexts/Web3Context/context"
import ContractRow from "../ContractRow"
import useTerminus from "../../contexts/TerminusContext"

const TerminusView = () => {
  const {
    recentAddresses,
    setRecentAddresses,
    contractAddress,
    setContractAddress,
    selectPool,
    setSelectedPoolMetadata,
  } = useTerminus()
  const router = useRouter()

  const [addressInputValue, setAddressInputValue] = useState(contractAddress)

  const toast = useToast()

  useEffect(() => {
    const addresses = JSON.parse(localStorage.getItem("terminusContracts") ?? "undefined")
    setRecentAddresses(addresses)
  }, [])

  useEffect(() => {
    if (recentAddresses) {
      localStorage.setItem("terminusContracts", JSON.stringify(recentAddresses))
    }
  }, [recentAddresses])

  useEffect(() => {
    if (!router.query.poolId) {
      selectPool(1)
    } else {
      selectPool(Number(router.query.poolId))
    }
  }, [router.query.poolId])

  const { chainId, web3 } = useContext(Web3Context)

  useEffect(() => {
    setContractAddress(
      typeof router.query.contractAddress === "string" ? router.query.contractAddress : "",
    )
    setSelectedPoolMetadata({})
  }, [router.query.contractAddress, chainId])

  useEffect(() => {
    if (contractAddress) {
      setAddressInputValue(contractAddress)
    }
    setSelectedPoolMetadata({})
  }, [contractAddress])

  const handleSubmit = () => {
    if (web3.utils.isAddress(addressInputValue)) {
      setSelectedPoolMetadata({})
      router.push({
        pathname: "/terminus",
        query: {
          contractAddress: addressInputValue,
          poolId: router.query.poolId,
        },
      })
    } else {
      toast({
        render: () => (
          <Box borderRadius="5px" textAlign="center" color="black" p={1} bg="red.600">
            Invalid address
          </Box>
        ),
        isClosable: true,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSubmit()
    }
  }

  return (
    <Center>
      <Flex gap="30px" direction="column" px="7%" py="30px" color="white">
        <Flex gap="20px">
          <Input
            onKeyDown={handleKeyDown}
            w="50ch"
            placeholder="terminus contract address"
            type="text"
            value={addressInputValue}
            onChange={(e) => setAddressInputValue(e.target.value)}
          />
          <Button
            bg="gray.0"
            fontWeight="400"
            fontSize="18px"
            color="#2d2d2d"
            onClick={handleSubmit}
          >
            Show
          </Button>
        </Flex>
        {contractAddress && (
          <>
            <TerminusContractView />
            <Flex gap="40px" maxH="700px">
              <TerminusPoolsListView />
              <TerminusPoolView />
            </Flex>
          </>
        )}
        {!contractAddress && recentAddresses && (
          <Flex direction="column" gap="20px" bg="#2d2d2d" borderRadius="10px" p="20px">
            <Text>Recent</Text>
            {Object.keys(recentAddresses).map((address) => {
              const { chainId, name, image } =
                recentAddresses[address as keyof typeof recentAddresses]
              return (
                <ContractRow
                  key={address}
                  address={address}
                  chainId={chainId}
                  name={name}
                  image={image}
                />
              )
            })}
          </Flex>
        )}
      </Flex>
    </Center>
  )
}

export default TerminusView
