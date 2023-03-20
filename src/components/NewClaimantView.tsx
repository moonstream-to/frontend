/* eslint-disable react/no-children-prop */
import { useContext, useState } from "react"

import { useMutation, useQueryClient } from "react-query"
import Papa from "papaparse"
import { SmallCloseIcon } from "@chakra-ui/icons"
import { Flex, IconButton, Input, Spinner, Text, Icon, Button } from "@chakra-ui/react"
import { AiOutlineSave } from "react-icons/ai"

import Web3Context from "../contexts/Web3Context/context"
import useMoonToast from "../hooks/useMoonToast"
import http from "../utils/http"
import FileUpload from "./FileUpload"
import useDrop from "../hooks/useDrop"

const NewClaimantView = ({ claimId, setAdding }: { claimId: string; setAdding: any }) => {
  const API = process.env.NEXT_PUBLIC_ENGINE_API_URL ?? process.env.NEXT_PUBLIC_PLAY_API_URL //TODO

  const toast = useMoonToast()

  const [newAddress, setNewAddress] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [existingClaimant, setExistingClaimant] = useState<
    { address: string; amount: string } | undefined
  >(undefined)
  const queryClient = useQueryClient()
  const web3ctx = useContext(Web3Context)
  const { uploadFile } = useDrop({
    ctx: web3ctx,
    claimId: claimId,
  })

  const onDoneAdding = (justClean = false) => {
    setNewAddress("")
    setNewAmount("")
    if (!justClean) {
      setAdding(false)
    }
    setExistingClaimant(undefined)
  }

  const addClaimants = useMutation(
    async ({ claimants }: { claimants: { address: string; amount: number }[] }) => {
      const wrongAddressClaimant = claimants.find(
        (claimant) => !web3ctx.web3.utils.isAddress(claimant.address),
      )
      if (wrongAddressClaimant) {
        return new Promise((_, reject) => {
          reject(new Error(`${wrongAddressClaimant.address} is not valid address`))
        })
      }

      const wrongAmountClaimant = claimants.find(
        (claimant) => !claimant.amount || claimant.amount < 1,
      )
      if (wrongAmountClaimant) {
        return new Promise((_, reject) => {
          reject(
            new Error(
              `Wrong amount - ${wrongAmountClaimant.amount} - for ${wrongAmountClaimant.address}`,
            ),
          )
        })
      }
      const data = { dropper_claim_id: claimId, claimants: claimants }

      if (claimants.length === 1 && !existingClaimant) {
        try {
          const res = await http({
            method: "GET",
            url: `${API}/admin/drops/${claimId}/claimants/search`,
            params: { address: claimants[0].address },
          })
          if (res.data?.address) {
            setExistingClaimant({
              address: res.data.address,
              amount: res.data.raw_amount,
            })
            return new Promise((_, reject) => {
              reject(new Error("address already exists"))
            })
          }
        } catch (e) {
          console.log(e)
        }
      }
      return http({
        method: "POST",
        url: `${API}/drops/claimants`,
        data: data,
      })
    },
    {
      onSuccess: () => {
        setExistingClaimant(undefined)
        queryClient.invalidateQueries("claimants")
        toast("Claimant updated", "success")
        onDoneAdding()
      },
      onError: (e: Error) => {
        if (e.message !== "address already exists") {
          toast(e.message, "error")
        }
      },
    },
  )

  const [isUploading, setIsUploading] = useState(false)
  const querClient = useQueryClient()

  const handleParsingError = function (error: string): void {
    setIsUploading(false)
    toast(error, "error", 7000)
    throw error
  }

  const validateHeader = function (headerValue: string, column: number): string {
    const header = headerValue.trim().toLowerCase()
    if (column == 0 && header != "address") {
      handleParsingError("First column header must be 'address'")
    }
    if (column == 1 && header != "amount") {
      handleParsingError("Second column header must be 'amount'")
    }
    return header
  }
  let parserLineNumber = 0

  const validateCellValue = function (cellValue: string, column: any): string {
    const value = cellValue.trim()
    if (column == "address") {
      parserLineNumber++
      try {
        web3ctx.web3.utils.toChecksumAddress(value)
      } catch (error) {
        handleParsingError(
          `Error parsing value '${value}' on line ${parserLineNumber}. Value in 'address' column must be a valid address.`,
        )
      }
    }
    if (column == "amount") {
      const numVal = parseInt(value)
      if (isNaN(numVal) || numVal < 0) {
        handleParsingError(
          `Error parsing value: '${value}' on line ${parserLineNumber}. Value in 'amount' column must be an integer.`,
        )
      }
    }
    return value
  }

  const onDrop = (file: any) => {
    if (!file.length) {
      return
    }
    parserLineNumber = 0
    setIsUploading(true)
    Papa.parse(file[0], {
      header: true,
      skipEmptyLines: true,
      fastMode: true,
      transform: validateCellValue,
      transformHeader: validateHeader,
      complete: (result: any) => {
        uploadFile.mutate(
          {
            dropperClaimId: claimId,
            claimants: result.data,
          },
          {
            onSettled: (_, error) => {
              setIsUploading(false)
              if (!error) {
                setAdding(false)
                querClient.refetchQueries(["claimants", "claimId", claimId])
              }
            },
          },
        )
      },
      error: (err: Error) => handleParsingError(err.message),
    })
  }

  return (
    <>
      {!existingClaimant && (
        <Flex direction="column" gap="20px">
          <Flex alignItems="center" gap="10px">
            <Flex fontSize="16px" direction="column" gap="5px" maxW="43ch">
              <Text>Address:</Text>
              <Input
                variant="address"
                fontSize="16px"
                pl="auto"
                pr="auto"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </Flex>
            <Flex direction="column" w="100%" gap="5px">
              <Text>Amount:</Text>
              <Flex gap="5px" alignItems="center">
                <Input
                  variant="address"
                  fontSize="16px"
                  w="10ch"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
                {!addClaimants.isLoading ? (
                  <IconButton
                    bg="transparent"
                    aria-label="cancel"
                    icon={<Icon as={AiOutlineSave} />}
                    _hover={{ bg: "#3f3f3f" }}
                    disabled={isUploading}
                    onClick={() =>
                      addClaimants.mutate({
                        claimants: [{ address: newAddress, amount: Number(newAmount) }],
                      })
                    }
                  />
                ) : (
                  <Spinner mx="12px" w="16px" h="16px" />
                )}
                <IconButton
                  bg="transparent"
                  aria-label="cancel"
                  icon={<SmallCloseIcon />}
                  onClick={() => onDoneAdding()}
                  disabled={addClaimants.isLoading || isUploading}
                  _hover={{ bg: "#3f3f3f" }}
                />
              </Flex>
            </Flex>
          </Flex>
          {!addClaimants.isLoading && (
            <FileUpload minW="100%" isUploading={isUploading} onDrop={onDrop} />
          )}
        </Flex>
      )}
      {existingClaimant && (
        <Flex mt="10px" gap="10px">
          <Flex direction="column" w="42ch">
            <Text fontFamily="Jet Brains Mono, monospace">{existingClaimant.address} </Text>
            <Text w="40ch">
              {`has ${existingClaimant.amount} already. Do
           you want to update it to ${newAmount}?`}
            </Text>
          </Flex>
          <Flex w="100%" justifyContent="center" gap="10px" alignItems="center">
            <Button
              bg="transparent"
              border="1px solid white"
              disabled={addClaimants.isLoading}
              _hover={{ bg: "#3f3f3f" }}
              onClick={() =>
                addClaimants.mutate({
                  claimants: [{ address: newAddress, amount: Number(newAmount) }],
                })
              }
            >
              {!addClaimants.isLoading ? <Text>Yes</Text> : <Spinner />}
            </Button>
            <Button
              bg="transparent"
              _hover={{ bg: "#3f3f3f" }}
              border="1px solid white"
              disabled={addClaimants.isLoading}
              onClick={() => onDoneAdding(true)}
            >
              No
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  )
}

export default NewClaimantView
