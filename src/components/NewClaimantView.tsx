/* eslint-disable react/no-children-prop */
import { useContext, useState } from "react"

import { useMutation, useQueryClient } from "react-query"
import { SmallCloseIcon } from "@chakra-ui/icons"
import { Flex, IconButton, Input, Spinner, Text, Icon, Button } from "@chakra-ui/react"
import { AiOutlineSave } from "react-icons/ai"

import Web3Context from "../contexts/Web3Context/context"
import useMoonToast from "../hooks/useMoonToast"
import http from "../utils/http"

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

  const onDoneAdding = () => {
    setNewAddress("")
    setNewAmount("")
    setAdding(false)
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
      //   return http({
      //     method: "GET",
      //     url: `${API}/admin/drops/${claimId}/claimants/search`,
      //     params: { address: claimants[0].address },
      //   }).then((res: any) => {
      //     console.log(res)
      //     if (res.data?.address) {
      //       setExistingClaimant({
      //         address: res.data.address,
      //         amount: res.data.raw_amount,
      //       })
      //       return new Promise((_, reject) => {
      //         reject(new Error("address already exists"))
      //       })
      //     } else {
      //       return http({
      //         method: "POST",
      //         url: `${API}/drops/claimants`,
      //         data: data,
      //       })
      //     }
      //   })
      // } else {
      //   return http({
      //     method: "POST",
      //     url: `${API}/drops/claimants`,
      //     data: data,
      //   })
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
      {!existingClaimant && (
        <Flex alignItems="center" gap="10px">
          <Flex fontSize="16px" direction="column" gap="5px" maxW="43ch">
            <Text>Address:</Text>
            <Input
              // fontFamily="Jet Brains Mono, monospace"
              variant="address"
              fontSize="16px"
              pl="auto"
              pr="auto"
              // w="43ch"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </Flex>
          <Flex direction="column" w="100%" gap="5px">
            <Text>Amount:</Text>
            <Flex gap="5px">
              <Input
                variant="address"
                fontSize="16px"
                w="10ch"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
              {!addClaimants.isLoading || existingClaimant ? (
                <IconButton
                  bg="transparent"
                  aria-label="cancel"
                  icon={<Icon as={AiOutlineSave} />}
                  _hover={{ bg: "#3f3f3f" }}
                  onClick={() =>
                    addClaimants.mutate({
                      claimants: [{ address: newAddress, amount: Number(newAmount) }],
                    })
                  }
                />
              ) : (
                <Spinner />
              )}
              <IconButton
                bg="transparent"
                aria-label="cancel"
                icon={<SmallCloseIcon />}
                onClick={() => onDoneAdding()}
                _hover={{ bg: "#3f3f3f" }}
              />
            </Flex>
          </Flex>
        </Flex>
      )}
      {existingClaimant && (
        <Flex mt="10px" gap="10px">
          <Text pl="5px">
            {`${existingClaimant.address}  is already in the list with amount of ${existingClaimant.amount}. Do
           you want to update amount to ${newAmount}?`}
          </Text>
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
            onClick={() => onDoneAdding()}
          >
            No
          </Button>
        </Flex>
      )}
    </>
  )
}

export default NewClaimantView
