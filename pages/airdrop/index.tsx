/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useState } from 'react'

import { useMutation } from 'react-query'
import axios from 'axios'
import { Button, Center, Flex, Input, Text } from '@chakra-ui/react'

import Layout from '../../src/components/layout'
import Spinner from '../../src/components/Spinner/Spinner'
import Web3Context from '../../src/contexts/Web3Context/context'
import { ENTITY_API, WHITELIST_EVENT_COLLECTION_ID } from '../../src/constants'
import useMoonToast from '../../src/hooks/useMoonToast'

const Airdrop = () => {
  const toast = useMoonToast()
  const [claimantAddress, setClaimantAddress] = useState('')
  const [claimantEmail, setClaimantEmail] = useState('')
  const [claimantDiscord, setClaimantDiscord] = useState('')

  const { web3 } = useContext(Web3Context) 


  const onError = (error: {message: string}) => {
    toast(error?.message ?? 'Error', 'error', 5000)
  }

  const createPublicEntryMutation = useMutation(({address, email, discord}: {address: string; email: string; discord: string }) => {
    return axios.get(`${ENTITY_API}/public/collections/${WHITELIST_EVENT_COLLECTION_ID}/search?required_field=address:${claimantAddress}`)
    .then((res) => {
      if (res.data?.total_results >= 1) {
        return new Promise((_, reject) => {
          reject(new Error('already claimed'))
        })
      }
      const data = {
        address,
        blockchain: 'polygon',
        name: 'Public claimant',
        required_fields: [{ email }, { discord }],
      }
      return axios.post(`${ENTITY_API}/public/collections/${WHITELIST_EVENT_COLLECTION_ID}/entities`, data)
    })
  },
  {
    onError: (error: Error) => onError(error),
    onSuccess: (data: any) => toast(`succesfully claimed for ${data?.data?.address}`, 'success', 5000),
  },)


  const handleSubmit = () => {
    if (claimantAddress === '' || claimantEmail === '' || claimantDiscord === '') {
      onError({message: 'please fill al fields'})
      return
    } 
    if (!web3.utils.isAddress(claimantAddress)) {
      onError({message: 'address is not valid'})
      return
    }
    createPublicEntryMutation.mutate({address: claimantAddress, email: claimantEmail, discord: claimantDiscord})
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Layout home={false}>
      <Text pl='7%' fontSize='40px' py='40px' color='white' fontWeight='700'>Claim</Text>
      <Center>
        <Flex fontSize='18px' direction='column' px='7%' color='white' mb='60px'>
          <Flex direction='column' gap='40px' borderRadius='10px' p='30px' maxW='560px' border='1px solid white'>
            <Flex direction='column' gap='10px'>
              <Text>Wallet address</Text>
              <Input               
                onKeyDown={handleKeyDown}
                w='50ch'
                placeholder='wallet address'
                type='text'
                value={claimantAddress}
                onChange={(e) => { 
                  setClaimantAddress(e.target.value)
                }}
                />
              <Text>Email</Text>
              <Input
                onKeyDown={handleKeyDown}
                w='50ch'
                placeholder='email'
                type='email'
                value={claimantEmail}
                onChange={(e) => setClaimantEmail(e.target.value)}
              />
              <Text>Discord</Text>
              <Input
                onKeyDown={handleKeyDown}
                w='50ch'
                placeholder='discord account'
                type='text'
                value={claimantDiscord}
                onChange={(e) => setClaimantDiscord(e.target.value)}
              />
            </Flex>
            <Button variant='plainOrange' borderRadius='10px' minW='100%' bg='#F56646' color='white' onClick={handleSubmit}>
              {createPublicEntryMutation.isLoading ? <Spinner h='22px' w='22px'/> : <Text>Claim</Text>}
            </Button>
          </Flex>
        </Flex>
      </Center>
    </Layout>
  )
}

export default Airdrop
