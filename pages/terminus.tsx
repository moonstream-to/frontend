/* eslint-disable @typescript-eslint/no-var-requires */
import { Box, Button, Center, Flex, Input, Select, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../src/components/layout'
import TerminusPoolsListView from '../src/components/TerminusPoolsListView'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TerminusPoolView from '../src/components/TerminusPoolView'

import TerminusContractView from '../src/components/TerminusContractView'
import Web3 from 'web3'

const Terminus = () => {
  const router = useRouter()
  const contractAddress =
    typeof router.query.contractAddress === 'string'
      ? router.query.contractAddress
      : ''
  const handleClick = (poolId: string, metadata: unknown) => {
    setSelected(Number(poolId))
    setPoolMetadata(metadata)
  }
  const [selected, setSelected] = useState(1)
  const [poolMetadata, setPoolMetadata] = useState<unknown>({})
  const [nextValue, setNextValue] = useState(contractAddress);
  const toast = useToast();
  const web3 = new Web3();

  const chains = [
    {
      chainId: '137',
      name: 'polygon',
    },
    {
      chainId: '80001',
      name: 'mumbai',
    }
  ]
  const [chainId, setChainId] = useState('80001')

  useEffect(() => {
    if (contractAddress) {
      setNextValue(contractAddress);
      setSelected(1);
    }
  }, [contractAddress]);

  const handleSubmit = () => {
    if (web3.utils.isAddress(nextValue)) {
      router.push({
        pathname: "/terminus",
        query: {
          contractAddress: nextValue,
        },
      });
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

  const handleKeyDown = ((e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleSubmit();
    }
  });

  const handleChainSelect = ((e: any) => {
    setChainId(e.target.value);
    handleSubmit();
  })

  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <Center>
        <Flex gap='30px' direction='column' px='7%' py='30px' color='white'>
          <Flex gap='20px'>
            <Input onKeyDown={handleKeyDown} w='50ch' placeholder='terminus contract address' type='text' value={nextValue} onChange={e => setNextValue(e.target.value)}/>
            <Select value={chainId} onChange={handleChainSelect} placeholder='' w='fit-content'>
              {chains.map((chain: {chainId: string, name: string}) => <option value={chain.chainId} key={chain.chainId}>{chain.name}</option>)}
            </Select>
            <Button
              bg='gray.0'
              fontWeight='400'
              fontSize='18px'
              color='#2d2d2d'
              onClick={handleSubmit}
            >
              Show
            </Button>
          </Flex>
          {contractAddress && (
            <>
              <TerminusContractView address={contractAddress} chainId={chainId}/>
              <Flex gap='40px' maxH='700px'>
                <TerminusPoolsListView
                  contractAddress={contractAddress}
                  onChange={handleClick}
                  selected={selected}
                  chainId={chainId}
                />
                <TerminusPoolView address={contractAddress} chainId={chainId} poolId={String(selected)} metadata={poolMetadata}/>
              </Flex>
            </>)}
        </Flex>
      </Center>
    </Layout>
  )
}

export default Terminus