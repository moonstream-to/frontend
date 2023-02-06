/* eslint-disable @typescript-eslint/no-var-requires */
import { Box, Button, Center, Flex, Input, Text, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../../src/components/layout'
import TerminusPoolsListView from '../../src/components/TerminusPoolsListView'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import TerminusPoolView from '../../src/components/TerminusPoolView'

import TerminusContractView from '../../src/components/TerminusContractView'
import Web3Context from '../../src/contexts/Web3Context/context'
import ContractRow from '../../src/components/ContractRow'

const Terminus = () => {
  const router = useRouter()
  const contractAddress = typeof router.query.contractAddress === 'string' ? router.query.contractAddress : ''
  const handleClick = (poolId: string, metadata: unknown) => {
    setSelected(Number(poolId))
    setPoolMetadata(metadata)
  }
  const [selected, setSelected] = useState(1)
  const [poolMetadata, setPoolMetadata] = useState<unknown>({})
  const [nextValue, setNextValue] = useState(contractAddress)
  const [recent, setRecent] = useState<{ address: { name: string; image: string; chainId: number } } | undefined>(undefined)
  const toast = useToast()

  useEffect(() => {
    setRecent(JSON.parse(localStorage.getItem('terminusContracts') ?? 'null'))
  }, [])

  useEffect(() => {
    if (contractAddress) {
      setNextValue(contractAddress)
      setSelected(1)
    }
  }, [contractAddress])

  const { chainId, web3 } = useContext(Web3Context)

  useEffect(() => {
    if (nextValue && web3.utils.isAddress(nextValue)) {
      handleSubmit()
    }
  }, [chainId])

  const handleSubmit = () => {
    if (web3.utils.isAddress(nextValue)) {
      router.push({
        pathname: '/terminus',
        query: {
          contractAddress: nextValue,
        },
      })
    } else {
      toast({
        render: () => (
          <Box borderRadius='5px' textAlign='center' color='black' p={1} bg='red.600'>
            Invalid address
          </Box>
        ),
        isClosable: true,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal - terminus</title>
      </Head>
      <Center>
        <Flex gap='30px' direction='column' px='7%' py='30px' color='white'>
          <Flex gap='20px'>
            <Input
              onKeyDown={handleKeyDown}
              w='50ch'
              placeholder='terminus contract address'
              type='text'
              value={nextValue}
              onChange={(e) => setNextValue(e.target.value)}
            />
            <Button bg='gray.0' fontWeight='400' fontSize='18px' color='#2d2d2d' onClick={handleSubmit}>
              Show
            </Button>
          </Flex>
          {contractAddress && (
            <>
              <TerminusContractView address={contractAddress} />
              <Flex gap='40px' maxH='700px'>
                <TerminusPoolsListView contractAddress={contractAddress} onChange={handleClick} selected={selected} />
                <TerminusPoolView address={contractAddress} poolId={String(selected)} metadata={poolMetadata} />
              </Flex>
            </>
          )}
          {!contractAddress && recent && (
            <Flex direction='column' gap='20px' bg='#2d2d2d' borderRadius='10px' p='20px'>
              <Text>Recent</Text>
              {Object.keys(recent).map((address) => {
                const { chainId, name, image } = recent[address as keyof typeof recent]
                return <ContractRow key={address} address={address} chainId={chainId} name={name} image={image} />
              })}
            </Flex>
          )}
        </Flex>
      </Center>
    </Layout>
  )
}

export default Terminus
