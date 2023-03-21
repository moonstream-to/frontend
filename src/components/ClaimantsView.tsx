/* eslint-disable react/no-children-prop */
import { useContext, useEffect, useState } from "react"

import { ChevronDownIcon, SearchIcon, SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons"
import {
  Collapse,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useDisclosure,
  Icon,
  Select,
  Button,
  Spacer,
} from "@chakra-ui/react"
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineCloudUpload,
  AiOutlineVerticalRight,
} from "react-icons/ai"

import Web3Context from "../contexts/Web3Context/context"
import useDrop from "../hooks/useDrop"
import useMoonToast from "../hooks/useMoonToast"
import http from "../utils/http"

import NewClaimantView from "./NewClaimantView"
import ClaimantsUpload from "./ClaimantsUpload"

const ClaimantsView = ({ claimId }: { claimId: string }) => {
  const API = process.env.NEXT_PUBLIC_ENGINE_API_URL ?? process.env.NEXT_PUBLIC_PLAY_API_URL //TODO

  const [searchString, setSearchString] = useState("")

  const toast = useMoonToast()
  const web3ctx = useContext(Web3Context)
  const { claimants, setClaimantsPage, claimantsPage, setClaimantsPageSize, claimantsPageSize } =
    useDrop({
      ctx: web3ctx,
      claimId: claimId,
    })
  const [displayingPages, setDisplayingPages] = useState("")

  const _pageOptions = ["10", "25", "50"]

  useEffect(() => {
    setClaimantsPageSize(Number(_pageOptions[0]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!claimants.data) {
      return
    }
    const length = Math.min(claimants.data.length, claimantsPageSize)
    if (length === 0) {
      setDisplayingPages("no more claimants")
    } else {
      setDisplayingPages(
        `showing ${claimantsPage * claimantsPageSize + 1} to ${
          claimantsPage * claimantsPageSize + length
        }`,
      )
    }
  }, [claimantsPage, claimantsPageSize, claimants.data])

  useEffect(() => {
    setClaimantsPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId])

  const [searchResult, setSearchResult] = useState<{
    result?: string | undefined
    isSearching: boolean
  }>({ isSearching: false })

  type responseWithDetails = {
    response: { data: { detail: string } }
    message: string
  }

  const searchForAddress = async (address: string) => {
    setSearchResult((prev) => {
      return { ...prev, isSearching: true }
    })

    http({
      method: "GET",
      url: `${API}/admin/drops/${claimId}/claimants/search`,
      params: { address },
    })
      .then((res: { data: { address: string; raw_amount: string } }) => {
        if (!res.data?.address) {
          throw new Error("Not found")
        }
        setSearchResult({ result: `Amount: ${res.data.raw_amount}`, isSearching: false })
      })
      .catch((e: responseWithDetails) => {
        const result =
          e.response?.data?.detail === "Address not present in that drop." ? "Not found" : e.message
        setSearchResult({ result, isSearching: false })
      })
  }

  const { onOpen, onClose, isOpen } = useDisclosure()
  const { onToggle: onToggleContent, isOpen: isOpenContent } = useDisclosure()
  const { onToggle: onToggleUpload, isOpen: isOpenUpload, onClose: onCloseUpload } = useDisclosure()
  const { onToggle: onToggleAdd, isOpen: isOpenAdd, onClose: onCloseAdd } = useDisclosure()

  const handleSearchClick = () => {
    if (web3ctx.web3.utils.isAddress(searchString)) {
      searchForAddress(searchString)
      onOpen()
    } else {
      toast("invalid address", "error")
    }
  }

  useEffect(() => {
    if (isOpenContent) {
      setTimeout(() => {
        const element = document.getElementById("claimants-view")
        element?.scrollIntoView({ behavior: "smooth" })
      }, 400)
    }
  }, [isOpenContent])

  return (
    <Flex
      direction="column"
      gap="20px"
      id="claimants-view"
      borderRadius="10px"
      bg="#232323"
      border="1px solid #4d4d4d"
      py={isOpenContent ? "20px" : "10px"}
      px="20px"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        onClick={!isOpenContent ? onToggleContent : undefined}
        cursor={isOpenContent ? "default" : "pointer"}
        gap="40px"
      >
        <Text fontSize="18px" fontWeight="700">
          Claimslist
        </Text>
        {isOpenContent && (
          <Button
            onClick={onToggleUpload}
            gap="10px"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            fontSize="16px"
            fontWeight="400"
          >
            <Icon as={AiOutlineCloudUpload} /> <Text>Update</Text>
          </Button>
        )}
        <Spacer />
        <IconButton
          aria-label="toggle"
          icon={isOpenContent ? <SmallCloseIcon /> : <ChevronDownIcon />}
          onClick={onToggleContent}
          _hover={{ bg: "transparent" }}
          bg="transparent"
        />
      </Flex>
      <Collapse in={isOpenUpload}>
        <ClaimantsUpload claimId={claimId} onClose={onCloseUpload} />
      </Collapse>
      <Collapse in={isOpenContent} animateOpacity>
        <Flex direction="column" gap="20px">
          <Flex justifyContent="space-between" alignItems="center">
            <InputGroup w="500px">
              <Input
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                placeholder="search for address"
                borderRadius="10px"
                p="8px 15px"
              />
              <InputRightElement
                w="80px"
                children={
                  <Flex>
                    <IconButton
                      icon={<SmallCloseIcon />}
                      _hover={{ color: "#ffccd4" }}
                      bg="transparent"
                      aria-label="clean"
                      onClick={() => setSearchString("")}
                      m="0"
                      minW="20px"
                    />
                    <IconButton
                      _hover={{ color: "#ffccd4" }}
                      bg="transparent"
                      aria-label="search"
                      icon={<SearchIcon />}
                      minW="20px"
                      onClick={() => handleSearchClick()}
                      pl="10px"
                    />
                  </Flex>
                }
              />
            </InputGroup>
            <Flex alignItems="center" gap="10px" cursor="pointer" onClick={onToggleAdd}>
              <Text>Add claimant</Text>
              <SmallAddIcon />
            </Flex>
          </Flex>

          <Collapse in={isOpen} animateOpacity>
            {searchResult.isSearching && <Spinner />}
            {!searchResult.isSearching && (
              <Flex justifyContent="space-between" alignItems="center">
                {!!searchResult.result && <Text>{searchResult.result}</Text>}
                <IconButton
                  bg="transparent"
                  aria-label="close"
                  icon={<SmallCloseIcon />}
                  onClick={() => {
                    setSearchString("")
                    onClose()
                  }}
                  _hover={{ bg: "#3f3f3f" }}
                />
              </Flex>
            )}
          </Collapse>
          {claimants.isLoading && <Spinner />}
          <Collapse in={isOpenAdd} animateOpacity>
            <NewClaimantView claimId={claimId} onClose={onCloseAdd} />
          </Collapse>
          {claimants.data && (
            <Flex gap="40px" fontSize="16px">
              <Flex direction="column">
                <Text py="10px" px="10px" borderBottom="0.5px solid #8b8b8b" fontWeight="700">
                  Address
                </Text>
                {claimants.data.map((claimant: { address: string }, idx: number) => (
                  <Text
                    py="12px"
                    px="10px"
                    key={idx}
                    fontFamily="Jet Brains Mono, monospace"
                    fontSize="16px"
                  >
                    {claimant.address}
                  </Text>
                ))}
              </Flex>
              <Flex direction="column">
                <Text py="10px" borderBottom="0.5px solid #8b8b8b" fontWeight="700">
                  Amount
                </Text>

                {claimants.data.map((claimant: { amount: string }, idx: number) => (
                  <Text py="12px" key={idx}>
                    {claimant.amount}
                  </Text>
                ))}
              </Flex>
            </Flex>
          )}
          <Flex alignItems="center" justifyContent="space-between" fontWeight="300">
            <Text>page {claimantsPage + 1}</Text>
            <Flex alignItems="center" justifyContent="center">
              <IconButton
                bg="transparent"
                aria-label="to start"
                _hover={{ bg: "#3f3f3f" }}
                icon={<Icon as={AiOutlineVerticalRight} />}
                onClick={() => setClaimantsPage(0)}
                disabled={claimantsPage < 1}
              />
              <IconButton
                bg="transparent"
                aria-label="to start"
                _hover={{ bg: "#3f3f3f" }}
                icon={<Icon as={AiOutlineArrowLeft} />}
                onClick={() => setClaimantsPage(claimantsPage - 1)}
                disabled={claimantsPage < 1}
              />
              <Text px="20px">{displayingPages}</Text>
              <IconButton
                bg="transparent"
                aria-label="to start"
                _hover={{ bg: "#3f3f3f" }}
                icon={<Icon as={AiOutlineArrowRight} />}
                onClick={() => setClaimantsPage(claimantsPage + 1)}
                disabled={!claimants.data || claimants.data.length < claimantsPageSize}
              />
            </Flex>
            <Flex gap="15px" alignItems="center" id="paginator">
              <Select
                bg="transparent"
                color="white"
                borderRadius="10px"
                borderColor="#4d4d4d"
                size="sm"
                w="fit-content"
                onChange={(e) => {
                  setClaimantsPageSize(Number(e.target.value))
                }}
                value={claimantsPageSize}
              >
                {_pageOptions.map((pageSize: string) => {
                  return (
                    <option key={`paginator-options-pagesize-${pageSize}`} value={pageSize}>
                      {pageSize}
                    </option>
                  )
                })}
              </Select>
              <Text>per page</Text>
            </Flex>
          </Flex>
        </Flex>
      </Collapse>
    </Flex>
  )
}

export default ClaimantsView
