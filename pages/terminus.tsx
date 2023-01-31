/* eslint-disable @typescript-eslint/no-var-requires */
import { Center, Flex } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../src/components/layout'
import TerminusPoolsListView from '../src/components/TerminusPoolsListView'
import { useRouter } from 'next/router'
import { useState } from 'react'
import TerminusPoolView from '../src/components/TerminusPoolView'

import TerminusContractView from '../src/components/TerminusContractView'

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

  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <Center>
        <Flex gap='30px' direction='column' px='7%' py='30px' color='white'>
          <TerminusContractView address={contractAddress} />
          <Flex gap='40px' maxH='700px'>
            <TerminusPoolsListView
              contractAddress={contractAddress}
              onChange={handleClick}
              selected={selected}
            />
            <TerminusPoolView address={contractAddress} poolId={String(selected)} metadata={poolMetadata}/>
          </Flex>
        </Flex>
      </Center>
    </Layout>
  )
}

export default Terminus
