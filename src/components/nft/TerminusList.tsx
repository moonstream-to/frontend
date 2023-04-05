/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext } from "react"
import { Flex, Image, Text, chakra, Spacer, VStack, Box, HStack } from "@chakra-ui/react"
import { useQuery } from "react-query"

import Web3Context from "../../contexts/Web3Context/context"
const terminusAbi = require("../../../src/web3/abi/MockTerminus.json")
import { MockTerminus as TerminusFacet } from "../../web3/contracts/types/MockTerminus"
import { hookCommon } from "../../hooks"

import TextWithPopup from "../TextWithPopup"
import { NFTInfo } from "./types"
import NFTList from "./NFTList"

const _TerminusList = ({
  terminusAddress,
  poolIdList,
  balances,
  ...props
}: {
  terminusAddress: string
  poolIdList: number[]
  balances: { [key: string]: number }
}) => {
  const web3ctx = useContext(Web3Context)

  const fetchMetdata = async (tokenURI: string) => {
    if (tokenURI && tokenURI.trim() != "") {
      return fetch(tokenURI, { cache: "no-cache" }).then((response) => response.json())
    } else {
      return null
    }
  }

  // TODO: Refactor this method for reuse. Use multicall.
  const getTokenURIs = async (terminusContract: TerminusFacet, poolIDs: number[]) => {
    const tokenURIPromises = poolIDs.map((poolID) => terminusContract.methods.uri(poolID).call())
    return await Promise.all(tokenURIPromises)
  }

  const getAllMetadata = async (uriList: string[]) => {
    const metadataPromises = uriList.map((uri) => {
      return fetchMetdata(uri)
    })
    return await Promise.all(metadataPromises)
  }

  const badges = useQuery<NFTInfo[]>(
    ["badges", terminusAddress, poolIdList],
    async () => {
      const inventory: NFTInfo[] = []

      if (terminusAddress == "0x0000000000000000000000000000000000000000") {
        return inventory
      }

      try {
        const terminusContract = new web3ctx.wyrmClient.eth.Contract(
          terminusAbi,
        ) as any as TerminusFacet
        terminusContract.options.address = terminusAddress

        const tokenURIs = await getTokenURIs(terminusContract, poolIdList)

        const tokenMetadata = await getAllMetadata(tokenURIs)

        const imageURIs = tokenMetadata.map((metadata) => (metadata ? metadata.image : null))

        poolIdList.forEach((poolId, index) => {
          const poolInfo: NFTInfo = {
            tokenID: poolId.toString(),
            tokenURI: tokenURIs[index],
            imageURI: tokenMetadata[index].image,
            metadata: tokenMetadata[index],
          }
          inventory.push(poolInfo)
        })
      } catch (e) {
        console.error("There was an issue retrieving information about user's characters: ")
        console.error(e)
      }

      return inventory
    },
    {
      ...hookCommon,
    },
  )

  return (
    <Flex {...props}>
      {badges.data &&
        badges.data.map((item: NFTInfo, idx: number) => {
          return (
            <HStack key={idx}>
              <Image src={item.imageURI} alt={item.metadata.name} w={100} h={100} />
              <VStack alignItems="left">
                <Text>{item.metadata.name}</Text>
                <Text>Quantity: {balances[item.tokenID]}</Text>
              </VStack>
            </HStack>
          )
        })}
    </Flex>
  )
}

const TerminusList = chakra(_TerminusList)
export default TerminusList
