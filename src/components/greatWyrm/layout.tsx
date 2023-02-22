import Head from 'next/head'

import { Flex } from '@chakra-ui/react'

import WyrmFooter from './WyrmFooter'
import WyrmNavbar from './WyrmNavbar'

const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`

export const siteTitle = 'great wyrml'

export default function Layout({ children, home }: { children: React.ReactNode; home?: boolean }) {
  return (
    <div>
      <Head>
        <link rel='icon' 
          href='/favicon.png' //TODO
        /> 
        <link href='https://fonts.googleapis.com/css?family=Cinzel' rel='stylesheet' />
        <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet' />
        <meta
          name='description'
          content='The only player-owned role-playing game in the world. Great Wyrm players have full control of the world we all play in.'
        />
        <meta name='og:title' content={siteTitle} />
        <meta
          name='keywords'
          content='games, gaming' //TODO
        />
        <meta name='og:image' 
          content={`${AWS_ASSETS_PATH}/metadata-image.png`} //TODO
        />
      </Head>
      <Flex minH='100vh' flexDirection='column' justifyContent='space-between' fontFamily='Cinzel'>
        {children}
        <WyrmFooter home={home} />
      </Flex>
    </div>
  )
}
