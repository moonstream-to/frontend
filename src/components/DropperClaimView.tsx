/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react"

import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  IconButton,
  useToast,
  Spinner,
  Button,
} from "@chakra-ui/react"
import { LinkIcon } from "@chakra-ui/icons"
import { Box, Flex, Spacer, Text } from "@chakra-ui/layout"
import { Image } from "@chakra-ui/image"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm"

import ClaimantsView from "./ClaimantsView"
import PoolDetailsRow from "./PoolDetailsRow"
import Web3Context from "../contexts/Web3Context/context"
import useDrops from "../hooks/useDrops"
import queryCacheProps from "../hooks/hookCommon"
import { PORTAL_PATH } from "../constants"
const dropperAbi = require("../web3/abi/Dropper.json")
import { Dropper } from "../web3/contracts/types/Dropper"
import http from "../utils/http"

const DropperClaimView = ({
  address,
  claimId,
  metadata,
}: {
  address: string
  claimId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any
}) => {
  const { chainId, web3 } = useContext(Web3Context)

  const headerMeta = ["name", "description", "image", "attributes"]
  const web3ctx = useContext(Web3Context)

  const toast = useToast()

  const { adminClaims } = useDrops({
    dropperAddress: address,
    ctx: web3ctx,
  })

  useEffect(() => {
    adminClaims.refetch()
  }, [address, web3ctx.account])

  const [dropState, setDropState] = useState<
    | {
        deadline: string
        id: string
        terminusAddress: string
        terminusPoolId: string
        active: boolean
      }
    | undefined
  >(undefined)

  useEffect(() => {
    if (adminClaims.data) {
      const claimState = adminClaims.data.find(
        (claim: { drop_number: number }) => claim.drop_number === Number(claimId),
      )
      if (claimState) {
        const {
          id,
          claim_block_deadline: deadline,
          terminus_address: terminusAddress,
          terminus_pool_id: terminusPoolId,
          active,
        } = claimState
        setDropState({
          id,
          terminusAddress,
          terminusPoolId,
          deadline,
          active,
        })
      } else {
        setDropState(undefined)
      }
    }
  }, [adminClaims.data, claimId])

  const dropTypes = new Map<string, string>([
    ["20", "ERC20"],
    ["721", "ERC721"],
    ["1155", "ERC1155"],
    ["1", "Mint Terminus"],
  ])

  const claimState = useQuery(
    ["claimState", address, claimId, chainId],
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dropperContract = new web3.eth.Contract(dropperAbi) as any as Dropper
      dropperContract.options.address = address ?? ""
      const claim = await dropperContract.methods.getClaim(claimId).call()
      const claimUri = await dropperContract.methods.claimUri(claimId).call() //TODO take from ClaimsList
      const signer = await dropperContract.methods.getSignerForClaim(claimId).call() //TODO MULTICALL?
      const dropType = dropTypes.get(claim[3]) ?? "undefined"
      return { claim, claimUri, signer, dropType }
    },
    {
      ...queryCacheProps,
      enabled: Number(claimId) > 0 && !!address,
      // onSuccess: () => {}, //TODO
    },
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          duration: 3000,
          render: () => (
            <Box borderRadius="10px" textAlign="center" color="black" p={3} bg="green.800">
              Copied to clipboard
            </Box>
          ),
        })
      })
      .catch((e) => {
        toast({
          duration: 3000,
          render: () => (
            <Box borderRadius="10px" textAlign="center" color="black" p={3} bg="red.800">
              {e}
            </Box>
          ),
        })
      })
  }

  const [tempCaption, setTempCaption] = useState("")
  const queryClient = useQueryClient()
  const API = process.env.NEXT_PUBLIC_ENGINE_API_URL ?? process.env.NEXT_PUBLIC_PLAY_API_URL

  const ADMIN_API = `${API}/admin`

  const setActive = useMutation(
    (active: boolean) => {
      if (!dropState) {
        return
      } //TODO
      return http({
        method: "PUT",
        url: `${ADMIN_API}/drops/${dropState?.id}/${active ? "" : "de"}activate`,
      }).then(() => setTempCaption(active ? "Activated" : "Deactivated"))
    },
    {
      onSuccess: () => {
        setTimeout(() => setTempCaption(""), 5000)
        queryClient.invalidateQueries("claimAdmin")
      },
    },
  )

  if (Number(claimId) < 1) {
    return <></>
  }

  return (
    <Flex
      id="claimView"
      bg="#2d2d2d"
      minW="800px"
      borderRadius="20px"
      p="30px"
      pb="0"
      color="white"
      direction="column"
      maxW="800px"
      position="relative"
    >
      {dropState && (
        <>
          {dropState?.active ? (
            <Button
              bg="#e85858"
              _hover={{ bg: "#ff6565" }}
              borderRadius="10px"
              fontWeight="700"
              position="absolute"
              right="30px"
              bottom="30px"
              fontSize="20px"
              zIndex="2"
              onClick={() => setActive.mutate(false)}
              w="241px"
            >
              {tempCaption !== ""
                ? tempCaption
                : !setActive.isLoading
                ? "Deactivate"
                : "Deactivating..."}
            </Button>
          ) : (
            <Button
              variant="plainOrange"
              w="241px"
              position="absolute"
              right="30px"
              bottom="30px"
              fontSize="20px"
              zIndex="2"
              onClick={() => setActive.mutate(true)}
            >
              {tempCaption !== ""
                ? tempCaption
                : !setActive.isLoading
                ? "Activate"
                : "Activating..."}
            </Button>
          )}
        </>
      )}
      <Flex gap={2}>
        <Text
          textAlign="start"
          color="#c2c2c2"
          w="fit-content"
          py={1}
          pr={0}
          borderBottom="1px solid #c2c2c2"
          fontSize="20px"
          mb="20px"
        >
          {`drop ${claimId}`}
        </Text>
        <IconButton
          bg="transparent"
          onClick={() =>
            copyToClipboard(`${PORTAL_PATH}/dropper/?contractAddress=${address}&claimId=${claimId}`)
          }
          color="#c2c2c2"
          _hover={{ bg: "transparent", color: "white" }}
          icon={<LinkIcon />}
          aria-label="copy link"
        />
      </Flex>
      {!!claimState.data && (
        <>
          {metadata?.name && (
            <Text fontWeight="700" fontSize="24px" mb="20px">
              {metadata.name}
            </Text>
          )}
          <Flex direction="column" gap="20px" overflowY="auto" id="claim-content">
            <Flex gap="20px">
              {metadata?.image && (
                <Image
                  w="140px"
                  h="140px"
                  borderRadius="20px"
                  border="1px solid #4d4d4d"
                  src={metadata.image}
                  alt="image"
                />
              )}
              {metadata?.description && (
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                  {metadata.description}
                </ReactMarkdown>
              )}
            </Flex>

            {claimState.data?.claim && (
              <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
                <PoolDetailsRow type="Token address" value={claimState.data.claim[1]} />
                <PoolDetailsRow type="Drop type" value={claimState.data.dropType} />

                <PoolDetailsRow type="Signer" value={claimState.data.signer} />
                <PoolDetailsRow
                  type="Metadata uri"
                  href={claimState.data.claimUri}
                  value={claimState.data.claimUri}
                />
                {dropState && (
                  <>
                    <PoolDetailsRow type="Deadline" value={String(dropState.deadline)} />
                    <PoolDetailsRow
                      href={`${PORTAL_PATH}/terminus/?contractAddress=${dropState.terminusAddress}&poolId=${dropState.terminusPoolId}`}
                      type="Terminus address"
                      value={String(dropState.terminusAddress)}
                    />

                    <PoolDetailsRow
                      href={`${PORTAL_PATH}/terminus/?contractAddress=${dropState.terminusAddress}&poolId=${dropState.terminusPoolId}`}
                      type="Terminus Pool"
                      value={String(dropState.terminusPoolId)}
                    />
                  </>
                )}
                {metadata && (
                  <Accordion allowMultiple>
                    <AccordionItem border="none">
                      <AccordionButton p="0" mb="10px">
                        <Spacer />
                        <Box as="span" flex="1" textAlign="right" pr="10px" fontWeight="700">
                          Metadata
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        {Object.keys(metadata)
                          .filter((key) => !headerMeta.includes(key))
                          .map((key) => {
                            return (
                              <PoolDetailsRow key={key} type={key} value={String(metadata[key])} />
                            )
                          })}
                        {metadata?.attributes && (
                          <>
                            <Text fontWeight="700" mt="20px">
                              Attributes:
                            </Text>

                            {metadata.attributes.map(
                              (attribute: { trait_type: string; value: string }) => (
                                <PoolDetailsRow
                                  key={attribute.trait_type}
                                  type={attribute.trait_type}
                                  value={String(attribute.value)}
                                  style={{ marginLeft: "20px" }}
                                />
                              ),
                            )}
                          </>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                )}
              </Flex>
            )}
            {dropState && <ClaimantsView claimId={dropState.id} />}
          </Flex>
        </>
      )}
      {claimState.isLoading && (
        <Flex alignItems="center" justifyContent="center" h="100%">
          <Spinner h="50px" w="50px" />
        </Flex>
      )}
    </Flex>
  )
}

export default DropperClaimView
