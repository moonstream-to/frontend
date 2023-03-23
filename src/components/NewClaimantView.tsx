/* eslint-disable react/no-children-prop */
import { useContext, useEffect, useState } from "react"

import { useMutation, useQueryClient } from "react-query"
import { SmallCloseIcon } from "@chakra-ui/icons"
import { Flex, IconButton, Input, Spinner, Text, Icon, Spacer } from "@chakra-ui/react"
import { AiOutlineCheck, AiOutlineExclamationCircle, AiOutlineSave } from "react-icons/ai"

import Web3Context from "../contexts/Web3Context/context"
import useMoonToast from "../hooks/useMoonToast"
import http from "../utils/http"

const NewClaimantView = ({ claimId, onClose }: { claimId: string; onClose: () => void }) => {
  const API = process.env.NEXT_PUBLIC_ENGINE_API_URL ?? process.env.NEXT_PUBLIC_PLAY_API_URL //TODO

  const toast = useMoonToast()

  const [newAddress, setNewAddress] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [inputIsCorrect, setInputIsCorrect] = useState(false)
  const [existingClaimant, setExistingClaimant] = useState<
    { address: string; amount: string } | undefined
  >(undefined)
  const queryClient = useQueryClient()
  const web3ctx = useContext(Web3Context)

  useEffect(() => {
    setInputIsCorrect(
      web3ctx.web3.utils.isAddress(newAddress) && !!Number(newAmount) && Number(newAmount) > 0,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAddress, newAmount])

  useEffect(() => {
    if (existingClaimant && newAddress !== existingClaimant.address) {
      setExistingClaimant(undefined)
    }
  }, [newAddress])

  const onDoneAdding = (justClean = false) => {
    setNewAddress("")
    setNewAmount("")
    if (!justClean) {
      onClose()
    }
    setExistingClaimant(undefined)
  }

  const [inputColor, setInputColor] = useState("white")
  useEffect(() => {
    if (existingClaimant) {
      setInputColor("#F5C841")
    } else {
      if (web3ctx.web3.utils.isAddress(newAddress) || newAddress.length === 0) {
        setInputColor("white")
      } else {
        setInputColor("red")
      }
    }
  }, [newAddress, existingClaimant])

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

  return (
    <>
      <Flex direction="column" gap="10px">
        <Flex gap="20px">
          <Input
            variant="address"
            fontSize="16px"
            pl="auto"
            pr="auto"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            maxW="45ch"
            w="45ch"
            borderColor={`${inputColor}!important`}
          />
          <Input
            variant="address"
            fontSize="16px"
            w="10ch"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <Spacer />
          <Flex alignItems="center">
            {!addClaimants.isLoading ? (
              <IconButton
                bg="transparent"
                aria-label="cancel"
                icon={<Icon as={existingClaimant ? AiOutlineSave : AiOutlineCheck} />}
                _hover={{ bg: "#3f3f3f" }}
                disabled={!inputIsCorrect}
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
              disabled={addClaimants.isLoading}
              _hover={{ bg: "#3f3f3f" }}
            />
          </Flex>
        </Flex>
        {existingClaimant && (
          <Flex justifyContent="space-between" fontSize="12px">
            <Flex alignItems="center" gap="5px">
              <Icon color="#F5C841" as={AiOutlineExclamationCircle} />
              <Text color="#F5C841">{`User is already on the claimlist with amount of ${existingClaimant.amount}`}</Text>
            </Flex>
            <Text color="#bfbfbf">Save to update amount or enter another address</Text>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default NewClaimantView
