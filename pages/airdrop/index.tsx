/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useState } from 'react'

import { Box, Button, Center, Flex, Input, Text, useToast } from '@chakra-ui/react'

import Layout from '../../src/components/layout'
import { useSearchPublicEntity, useCreatePublicEntity } from '../../src/hooks/usePublicEntities'

const Airdrop = () => {
  const toast = useToast()
  const [claimantAddress, setClaimantAddress] = useState('')
  const [claimantEmail, setClaimantEmail] = useState('')
  const [claimantDiscord, setClaimantDiscord] = useState('')
  const [claimedStatus, setClaimedStatus] = useState('')

  const onSuccess = () => {
    // Handle successful request
  }
  const onError = (error: any) => {
    console.log(error?.message)
    toast({
      render: () => (
        <Box borderRadius='5px' textAlign='center' color='black' p={1} bg='red.600'>
          {error?.message}
        </Box>
      ),
      isClosable: true,
    })
  }

  const {
    isLoading: isLoadingSearch,
    data: dataSearch,
    isFetching: isFetchingSearch,
    refetch: refetchSearch,
  } = useSearchPublicEntity(onSuccess, onError, claimantAddress)
  const {
    isLoading: isLoadingCreate,
    data: dataCreate,
    isFetching: isFetchingCreate,
    refetch: refetchCreate,
  } = useCreatePublicEntity(onSuccess, onError, claimantAddress, claimantEmail, claimantDiscord)

  const handleSubmit = () => {
    if (claimantAddress === '' || claimantEmail === '' || claimantDiscord === '') {
      toast({
        render: () => (
          <Box borderRadius='5px' textAlign='center' color='black' p={1} bg='red.600'>
            {'Please fulfill all fields'}
          </Box>
        ),
        isClosable: true,
      })
    } else {
      refetchSearch()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleSubmit()
    }
  }

  useEffect(() => {
    if (dataSearch) {
      if (dataSearch.total_results === 0 && claimantAddress !== '') {
        refetchCreate()
      } else if (dataSearch.total_results === 1) {
        setClaimedStatus('Already claimed for an address')
      }
    }
  }, [dataSearch])

  useEffect(() => {
    if (dataCreate) {
      setClaimedStatus(`Claimed for ${dataCreate.address}`)
    }
  }, [dataCreate])

  return (
    <Layout home={true}>
      <Center>
        <Flex gap='30px' direction='column' px='7%' py='30px' color='white'>
          <Box w='100%' px={['7%', null, '25%']} alignSelf='center'>
            <Input
              onKeyDown={handleKeyDown}
              w='50ch'
              my='10px'
              placeholder='wallet address'
              type='text'
              value={claimantAddress}
              onChange={(e) => setClaimantAddress(e.target.value)}
            />
            <Input
              onKeyDown={handleKeyDown}
              w='50ch'
              my='10px'
              placeholder='email'
              type='email'
              value={claimantEmail}
              onChange={(e) => setClaimantEmail(e.target.value)}
            />
            <Input
              onKeyDown={handleKeyDown}
              w='50ch'
              my='10px'
              placeholder='discord account'
              type='text'
              value={claimantDiscord}
              onChange={(e) => setClaimantDiscord(e.target.value)}
            />
            <br />
            <Button bg='gray.0' my='10px' fontWeight='400' fontSize='18px' color='#2d2d2d' onClick={handleSubmit}>
              Claim
            </Button>
          </Box>
          {claimedStatus && (
            <Flex direction='column' gap='20px' bg='#2d2d2d' borderRadius='10px' p='20px'>
              <Text>{claimedStatus}</Text>
            </Flex>
          )}
        </Flex>
      </Center>
    </Layout>
  )
}

export default Airdrop
