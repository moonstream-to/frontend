/* eslint-disable @typescript-eslint/no-var-requires */
import { useState } from 'react'

import { useMutation } from 'react-query'
import axios from 'axios'
import Web3 from 'web3'
import { Box, Button, Center, Flex, Input, Text, useToast } from '@chakra-ui/react'

import Layout from '../../src/components/layout'
import Spinner from '../../src/components/Spinner/Spinner'

const Airdrop = () => {
  const toast = useToast()
  const [claimantAddress, setClaimantAddress] = useState('')
  const [claimantEmail, setClaimantEmail] = useState('')
  const [claimantDiscord, setClaimantDiscord] = useState('')

  const web3 = new Web3()

  const ENTITY_API = process.env.NEXT_PUBLIC_ENTITY_API_URL
  const WHITELIST_EVENT_COLLECTION_ID = process.env.NEXT_PUBLIC_WHITELIST_EVENT_COLLECTION_ID

  const onSuccess = (data: any) => {
    toast({
    render: () => (
      <Box borderRadius='15px' border='2px solid white' textAlign='center' color='white' py={3} px={5} bg='#353535'>
        succesfully claimed for {data?.data?.address}
      </Box>
    ),
    duration: 5000,
    position: 'top',
  })}


  const onError = (error: any) => {
    toast({
      render: () => (
        <Box borderRadius='15px' border='2px solid #F56646' textAlign='center' color='#F56646' py={3} px={5} bg='#353535'>
          {error?.message}
        </Box>
      ),
      isClosable: true,
      position: 'top',
    })
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
    onError,
    onSuccess,
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
