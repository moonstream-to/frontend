import React, { useState, useEffect } from "react"
import {
  Flex,
  Text,
  chakra,
  Spacer,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Center,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { SearchIcon, CloseIcon } from "@chakra-ui/icons"
import { RxCounterClockwiseClock } from "react-icons/rx"

import Web3 from "web3"

const _SpyModeInput = ({ setAddress }: { setAddress: (value: string) => void }) => {
  const router = useRouter()

  const [showRecent, setShowRecent] = useState<boolean>(false)
  const [recentAddresses, setRecentAddresses] = useState<string[]>([])

  const addRecentAddress = (address: string) => {
    if (!recentAddresses.includes(address)) {
      recentAddresses.push(address)
      localStorage.setItem("spyWallets", JSON.stringify(recentAddresses))
    }
  }

  const removeRecentAddress = (address: string) => {
    const index = recentAddresses.indexOf(address)
    console.log(index)
    if (index >= 0) {
      recentAddresses.splice(index, 1)
    }
    localStorage.setItem("spyWallets", JSON.stringify(recentAddresses))
  }

  const removeAll = () => {
    setRecentAddresses([])
    localStorage.setItem("spyWallets", JSON.stringify([]))
  }

  useEffect(() => {
    setRecentAddresses(JSON.parse(localStorage.getItem("spyWallets") ?? "[]"))
  }, [router.asPath])
  return (
    <Box mb={6}>
      <InputGroup w="500px">
        <Input
          placeholder="Emter another wallet address"
          backgroundColor="#353535"
          focusBorderColor="#FFFFFF"
          border="0px"
          type="text"
          onFocus={() => {
            setShowRecent(true)
          }}
          onChange={(e) => {
            const val = e.target.value
            if (Web3.utils.isAddress(val)) {
              setAddress(val)
              setShowRecent(false)
              addRecentAddress(val)
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowRecent(false)
            }, 200)
          }}
          mb={2}
        />
        <InputRightElement>
          <SearchIcon />
        </InputRightElement>
      </InputGroup>
      <Flex
        w="500px"
        maxH="300px"
        border="1px"
        borderColor="#FFFFFF"
        backgroundColor="#2D2D2D"
        rounded="md"
        p={2}
        flexDirection="column"
        display={showRecent ? undefined : "none"}
      >
        <Flex>
          <Text fontSize={18} fontWeight="semibold">
            Your recent searches
          </Text>
          <Spacer />
          <Text
            fontSize={16}
            onClick={() => {
              console.log("removing all")
              removeAll()
            }}
          >
            Clear all
          </Text>
        </Flex>
        {recentAddresses.map((address, index) => {
          return (
            <Flex _hover={{ bg: "#4D4D4D" }} rounded="md" key={index}>
              <Center px={1}>
                <RxCounterClockwiseClock />
              </Center>
              <Text
                p={1}
                onClick={() => {
                  setAddress(address)
                }}
              >
                {address}
              </Text>
              <Spacer />
              <Center>
                <CloseIcon
                  onClick={() => {
                    removeRecentAddress(address)
                  }}
                />
              </Center>
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}

const SpyModeInput = chakra(_SpyModeInput)
export default SpyModeInput
