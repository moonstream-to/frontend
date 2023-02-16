import Head from 'next/head'

import { Center, Flex } from '@chakra-ui/react'

import FeatureCard from '../src/components/FeatureCard'
import Layout from '../src/components/layout'
import { AWS_ASSETS_PATH } from '../src/constants'

const assets = {
  airdrop: `${AWS_ASSETS_PATH}/airdrop.png`,
  armory: `${AWS_ASSETS_PATH}/airdrop.png`,
  terminus: `${AWS_ASSETS_PATH}/Terminus.png`,
}

const features = [
  {
    name: 'Airdrop',
    description: 'Claim your token',
    image: assets.airdrop,
    href: '/airdrop',
  },
  {
    name: 'Armory',
    description: 'Investigate project characters and items',
    image: assets.armory,
    href: '/armory',
  },
  {
    name: 'Terminus',
    description: 'Manage your access lists and more',
    image: assets.terminus,
    href: '/terminus',
  },
]

export default function Home() {
  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <Center>
        <Flex gap='40px'>
          {features.map((feature) => (
            <FeatureCard feature={feature} key='feature.name' />
          ))}
        </Flex>
      </Center>
    </Layout>
  )
}
