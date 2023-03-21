/* eslint-disable react/no-children-prop */
import { useContext, useState } from "react"

import { useQueryClient } from "react-query"
import Papa from "papaparse"
import { SmallCloseIcon } from "@chakra-ui/icons"
import { Flex } from "@chakra-ui/react"

import Web3Context from "../contexts/Web3Context/context"
import useMoonToast from "../hooks/useMoonToast"
import FileUpload from "./FileUpload"
import useDrop from "../hooks/useDrop"

const ClaimantsUpload = ({ claimId, onClose }: { claimId: string; onClose: () => void }) => {
  const toast = useMoonToast()

  const queryClient = useQueryClient()
  const web3ctx = useContext(Web3Context)
  const { uploadFile } = useDrop({
    ctx: web3ctx,
    claimId: claimId,
  })

  const [isUploading, setIsUploading] = useState(false)

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

  const validateCellValue = function (cellValue: string, column: string): string {
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
                queryClient.refetchQueries(["claimants", "claimId", claimId])
                onClose()
              }
            },
          },
        )
      },
      error: (err: Error) => handleParsingError(err.message),
    })
  }

  return (
    <Flex position="relative">
      <FileUpload minW="100%" isUploading={isUploading} onDrop={onDrop} />
      <SmallCloseIcon
        position="absolute"
        right="10px"
        top="10px"
        onClick={onClose}
        cursor="pointer"
      />
    </Flex>
  )
}

export default ClaimantsUpload
