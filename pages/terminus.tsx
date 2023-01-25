import { Flex } from '@chakra-ui/react'
import Head from 'next/head'
import Layout from '../src/components/layout'
import TerminusPoolsListView from '../src/components/TerminusPoolsListView'
import { useRouter } from 'next/router'
import { useState } from 'react'
import TerminusPoolView from '../src/components/TerminusPoolView'

const Terminus = () => {
  const router = useRouter()
  console.log(router.query.contractAddress)
  // const contractAddress = '0x99A558BDBdE247C2B2716f0D4cFb0E246DFB697D'
  const contractAddress =
    typeof router.query.contractAddress === 'string'
      ? router.query.contractAddress
      : ''
  //'0x99A558BDBdE247C2B2716f0D4cFb0E246DFB697D'
  const handleClick = (id: string) => {
    setSelected(id)
  }
  const [selected, setSelected] = useState('1')
  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <Flex px='7%' py='30px' gap='40px'>
        <TerminusPoolsListView
          contractAddress={contractAddress}
          onChange={handleClick}
          selected={selected}
        />
        <TerminusPoolView address={contractAddress} poolId={selected} />
      </Flex>
    </Layout>
  )
}

export default Terminus
