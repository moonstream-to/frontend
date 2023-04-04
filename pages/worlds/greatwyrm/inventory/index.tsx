/* eslint-disable @typescript-eslint/no-var-requires */
import Head from "next/head"

import { use, useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { Box, Flex, Text } from "@chakra-ui/react"

import Layout from "../../../../src/components/layout"
import Web3 from "web3"
import Web3Context from "../../../../src/contexts/Web3Context/context"
const terminusAbi = require("../../../../src/web3/abi/MockTerminus.json")
import { MockTerminus as TerminusFacet } from "../../../../src/web3/contracts/types/MockTerminus"
const erc721Abi = require("../../../../src/web3/abi/MockERC721.json")
import { MockERC721 as Erc721Facet } from "../../../../src/web3/contracts/types/MockERC721"
const gardenAbi = require("../../../../src/web3/abi/GoFPABI.json")
import { GOFPFacet as GardenFacet } from "../../../../src/web3/contracts/types/GOFPFacet"
import { hookCommon } from "../../../../src/hooks"
import NFTList from "../../../../src/components/nft/NFTList"
import { NFTInfo } from "../../../../src/components/nft/types"
import { StakedTokenInfo } from "../../../../src/types/Moonstream"
import Link from "next/link"
import RadioFilter from "../../../../src/components/RadioFilter"
import TerminusList from "../../../../src/components/nft/TerminusList"
import SpyModeInput from "../../../../src/components/SpyModeInput"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const Inventory = () => {
  const router = useRouter()
  const queryAddress = router.query["spyAddress"] as string

  const web3ctx = useContext(Web3Context)
  const [currentAccount, setCurrentAccount] = useState(ZERO_ADDRESS)

  const terminusAddress = "0x49ca1F6801c085ABB165a827baDFD6742a3f8DBc"
  const characterAddress = "0xDfbC5320704b417C5DBbd950738A32B8B5Ed75b3"
  const greatwyrmContractAddress = "0x42A8E82253CD19EF8274D48fC0bC89cdf1B4425b"

  type terminusType = "gamemaster" | "character_creation" | "experience"
  const terminusTypes: terminusType[] = ["gamemaster", "character_creation", "experience"]
  const terminusPoolIds: { [key in terminusType]: number } = {
    gamemaster: 1,
    character_creation: 2,
    experience: 3,
  }

  const defaultBalances: { [key in terminusType]: number } = {
    gamemaster: 0,
    character_creation: 0,
    experience: 0,
  }

  const terminusBalances = useQuery<{ [key in terminusType]: number }>(
    ["terminus_pools", currentAccount],
    async ({ queryKey }) => {
      const currentUserAddress = queryKey[1]

      const currentBalances = { ...defaultBalances }

      if (currentUserAddress == ZERO_ADDRESS) {
        return currentBalances
      }

      const terminusFacet = new web3ctx.wyrmClient.eth.Contract(terminusAbi) as any as TerminusFacet
      terminusFacet.options.address = terminusAddress

      const accounts: string[] = []
      const poolIds: number[] = []

      terminusTypes.forEach((terminusType) => {
        const pool = terminusPoolIds[terminusType]
        if (pool > 0) {
          accounts.push(`${currentUserAddress}`)
          poolIds.push(pool)
        }
      })

      try {
        const balances = await terminusFacet.methods.balanceOfBatch(accounts, poolIds).call()
        balances.forEach((balance, index) => {
          currentBalances[terminusTypes[index]] = parseInt(balance, 10)
        })
      } catch (e) {
        console.error(
          `Inventory: Could not retrieve terminus balances for the given user: ${currentUserAddress}. Terminus pool IDs: ${poolIds}. Terminus contract address: ${terminusAddress}.`,
        )
      }

      return currentBalances
    },
    {
      ...hookCommon,
    },
  )

  const fetchMetdata = async (tokenURI: string) => {
    if (tokenURI && tokenURI.trim() != "") {
      return fetch(tokenURI, { cache: "no-cache" }).then((response) => response.json())
    } else {
      return null
    }
  }

  const getTokenURIs = async (characterContract: Erc721Facet, tokenIDs: number[]) => {
    const tokenURIPromises = tokenIDs.map((tokenID) =>
      characterContract.methods.tokenURI(tokenID).call(),
    )
    return await Promise.all(tokenURIPromises)
  }

  const playerOwnedCharacters = useQuery<NFTInfo[]>(
    ["playerCharacters", characterAddress, currentAccount],
    async ({ queryKey }) => {
      const currentUserAddress = String(queryKey[2])

      const inventory: NFTInfo[] = []

      if (currentUserAddress == ZERO_ADDRESS) {
        return inventory
      }

      const characterContract = new web3ctx.wyrmClient.eth.Contract(
        erc721Abi,
      ) as unknown as Erc721Facet
      characterContract.options.address = String(queryKey[1])

      try {
        const numCharsRaw: string = await characterContract.methods
          .balanceOf(currentUserAddress)
          .call()

        let numChars = 0
        try {
          numChars = parseInt(numCharsRaw, 10)
        } catch (e) {
          console.error(
            `Error: Could not parse number of owned characters as an integer: ${numCharsRaw}`,
          )
        }

        const tokenIDPromises = []
        for (let i = 0; i < numChars; i++) {
          tokenIDPromises.push(
            characterContract.methods.tokenOfOwnerByIndex(currentUserAddress, i).call(),
          )
        }
        const tokenIDs = await Promise.all(tokenIDPromises)

        const tokenURIs = await getTokenURIs(
          characterContract,
          tokenIDs.map((tokenId) => parseInt(tokenId)),
        )

        const tokenMetadataPromises = tokenURIs.map((tokenURI) => {
          return fetchMetdata(tokenURI)
        })
        const tokenMetadata = await Promise.all(tokenMetadataPromises)

        const imageURIs = tokenMetadata.map((metadata) => (metadata ? metadata.image : null))

        tokenIDs.forEach((tokenID, index) => {
          inventory.push({
            tokenID,
            tokenURI: tokenURIs[index],
            imageURI: imageURIs[index],
            metadata: tokenMetadata[index],
          })
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

  const getSessionCount = async (gameContract: GardenFacet) => {
    return parseInt(await gameContract.methods.numSessions().call())
  }

  const getStakedCount = async (gameContract: GardenFacet, sessionId: number, staker: string) => {
    return parseInt(await gameContract.methods.numTokensStakedIntoSession(sessionId, staker).call())
  }

  const getTokensStakedInSession = async (
    gameContract: GardenFacet,
    sessionId: number,
    staker: string,
  ) => {
    const numStaked = await getStakedCount(gameContract, sessionId, staker)
    const tokens: number[] = []
    for (let i = 1; i <= numStaked; i++) {
      const tokenId = parseInt(
        await gameContract.methods.tokenOfStakerInSessionByIndex(sessionId, staker, i).call(),
      )
      tokens.push(tokenId)
    }
    return tokens
  }

  const formatSessionCharacterArray = (
    map: Map<number, StakedTokenInfo>,
  ): { sessionId: number; characters: StakedTokenInfo[] }[] => {
    const sessionCharacterMap: Map<number, StakedTokenInfo[]> = new Map<number, StakedTokenInfo[]>()
    map.forEach((value: StakedTokenInfo) => {
      const sessionId = value.sessionId
      if (sessionCharacterMap.has(sessionId)) {
        sessionCharacterMap.get(sessionId)?.push(value)
      } else {
        sessionCharacterMap.set(sessionId, [value])
      }
    })

    const sessionCharacterArray: { sessionId: number; characters: StakedTokenInfo[] }[] = []
    sessionCharacterMap.forEach((value: StakedTokenInfo[], key: number) => {
      sessionCharacterArray.push({ sessionId: key, characters: value })
    })
    sessionCharacterArray.sort((a, b) => {
      return a.sessionId - b.sessionId
    })
    return sessionCharacterArray
  }

  const contractOwnedCharacters = useQuery(
    ["contractCharacters", greatwyrmContractAddress, characterAddress, currentAccount],
    async ({ queryKey }) => {
      const currentUserAddress = String(queryKey[3])

      if (currentUserAddress == ZERO_ADDRESS) {
        return []
      }

      const gameContract = new web3ctx.wyrmClient.eth.Contract(gardenAbi) as unknown as GardenFacet
      gameContract.options.address = greatwyrmContractAddress

      const characterContract = new web3ctx.wyrmClient.eth.Contract(
        erc721Abi,
      ) as unknown as Erc721Facet
      characterContract.options.address = characterAddress

      const numSessions = await getSessionCount(gameContract)

      const allTokens: number[] = []
      const stakedTokenMap: Map<number, number> = new Map<number, number>()

      for (let i = 1; i <= numSessions; i++) {
        const sessionStakedTokens = await getTokensStakedInSession(
          gameContract,
          i,
          currentUserAddress,
        )
        sessionStakedTokens.forEach((tokenId) => {
          allTokens.push(tokenId)
          stakedTokenMap.set(tokenId, i)
        })
      }

      const tokenURIs = await getTokenURIs(characterContract, allTokens)

      const tokenMetadata = await Promise.all(
        tokenURIs.map((tokenURI) => {
          return fetchMetdata(tokenURI)
        }),
      )

      const metadataMap: Map<number, StakedTokenInfo> = new Map<number, StakedTokenInfo>()

      tokenMetadata.map(async (metadata, index) => {
        const tokenId = allTokens[index]
        const info: StakedTokenInfo = {
          tokenID: tokenId.toString(),
          tokenURI: tokenURIs[index],
          imageURI: metadata ? metadata.image : null,
          metadata: metadata,
          sessionId: stakedTokenMap.get(tokenId) || 0,
        }
        metadataMap.set(tokenId, info)
      })

      return formatSessionCharacterArray(metadataMap)
    },
    {
      ...hookCommon,
    },
  )

  const formatTerminusBalances = (balances: { [key in terminusType]: number }) => {
    const terminusBalances: { [key: number]: number } = {}
    for (const key in balances) {
      const typeName = key as terminusType
      terminusBalances[terminusPoolIds[typeName]] = balances[typeName] || 0
    }
    return terminusBalances
  }

  enum AssetType {
    Characters = "Characters",
    Tokens = "Tokens",
  }
  const [assetType, setAssetType] = useState<AssetType>(AssetType.Characters)
  const handleChange = (value: string) => {
    if (value == "Tokens") setAssetType(AssetType.Tokens)
    else setAssetType(AssetType.Characters)
  }
  const setAddress = (address: string) => {
    router.replace({
      query: { ...router.query, spyAddress: address },
    })
  }

  useEffect(() => {
    let nextAddress = ZERO_ADDRESS
    if (queryAddress && Web3.utils.isAddress(queryAddress)) {
      nextAddress = queryAddress
    } else {
      nextAddress = web3ctx.account
    }
    if (Web3.utils.isAddress(nextAddress) && nextAddress != ZERO_ADDRESS) {
      setCurrentAccount(nextAddress)
    }
  }, [web3ctx.account, queryAddress])

  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal - Inventory</title>
      </Head>
      <Box py={10} ml="108px">
        <Text fontSize="lg" pb={2}>
          Showing inventory for wallet {currentAccount}
        </Text>
        <SpyModeInput setAddress={setAddress} />
        {terminusBalances.data && (
          <>
            <Text>
              Role:
              {terminusBalances.data && terminusBalances.data["gamemaster"] > 0
                ? " Game Master"
                : " Player"}
            </Text>
            <Text>Character Creation tokens: {terminusBalances.data["character_creation"]}</Text>
          </>
        )}
        <Box py={6}>
          <RadioFilter list={["Characters", "Tokens"]} handleChange={handleChange}></RadioFilter>
        </Box>
        {assetType == AssetType.Characters && (
          <Flex flexDir="column">
            <Flex flexDirection="column">
              <Text fontSize="lg" fontWeight="semibold">
                In Session
              </Text>
              {contractOwnedCharacters.data &&
                contractOwnedCharacters.data.map((value, index) => {
                  return (
                    <Flex key={index} flexDirection="column" mt={6}>
                      <Link href="/games/garden/?sessionId=1&amp;contractId=0x42A8E82253CD19EF8274D48fC0bC89cdf1B4425b">
                        Session {value.sessionId}
                      </Link>
                      <NFTList nftList={value.characters} />
                    </Flex>
                  )
                })}
            </Flex>
            <Flex flexDirection="column" mt={12}>
              <Text fontSize="lg" fontWeight="semibold">
                Idle
              </Text>
              {playerOwnedCharacters.data && <NFTList nftList={playerOwnedCharacters.data} />}
            </Flex>
          </Flex>
        )}
        {assetType == AssetType.Tokens && (
          <Flex flexDirection="column">
            <TerminusList
              terminusAddress={terminusAddress}
              poolIdList={[3]}
              balances={formatTerminusBalances(terminusBalances.data || defaultBalances)}
            ></TerminusList>
          </Flex>
        )}
      </Box>
    </Layout>
  )
}

export default Inventory
