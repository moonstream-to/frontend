import Head from 'next/head'

import { Button, Center, Flex, Spacer, Text } from '@chakra-ui/react'

import Layout from '../../src/components/greatWyrm/layout'
import { AWS_ASSETS_PATH } from '../../src/constants'
import ImageFallback from '../../src/components/greatWyrm/ImageFallback'

const assets = {

}


export default function Home() {
  return (
    <Layout home={true}>
      <Head>
        <title>great wyrm</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' 
          href='/favicon.png' //TODO
        />
      </Head>
      <Center>
        <Flex gap={['40px', '80px', '80px']} py={['40px', '80px', '80px']} px={['22px', '54px', '54px']} w='100%' direction='column' fontSize={['16px', '18px', '18px']} lineHeight={['20px', '23px', '23px']}>
          <Flex direction='column' gap='20px' textAlign='center'>
          <ImageFallback text='illustration' h='194px' mb='20px'/>
            <Text fontWeight='700' fontSize={['30px', '40px', '40px']} lineHeight='100%'>Enter the world of Great Wyrm</Text>
            <Text>The only player-owned role-playing game in the world. Great Wyrm players have full control of the world we all play in.</Text>
          </Flex>
          <Flex direction={['column', 'row', 'row']} gap='20px' >
            <Button 
              color='black' 
              w='100%' 
              bg='linear-gradient(92.3deg, #EB8C6A 8.4%, #FFFFFF 126.31%)' 
              _hover={{bg: 'linear-gradient(263.61deg, #EAA88F -6.84%, #FFFFFF 128.87%)'}}
              borderRadius='30px'
              fontSize={['16px', '20px', '20px']}
              lineHeight='26px'
              py='10px'
              h={['40px', '46px', '46px']}
            >
              Create a character
            </Button>
            <Button 
              w='100%' 
              border='2px solid white'
              borderRadius='30px'
              bg='transparent'
              onClick={() => window.open('https://discord.gg/K56VNUQGvA')}
              _hover={{fontWeight: '700'}}
              fontSize={['16px', '20px', '20px']}
              h={['40px', '46px', '46px']}


            >
              Join our discord
            </Button>
          </Flex>
          <Flex direction='column' p='40px 20px' gap='30px' borderRadius='30px' border='1px solid white' textAlign='center'>
            <Text fontWeight='700' fontSize={['24px', '30px', '30px']} lineHeight='120%'>True Open Gaming License</Text>
            <Text>We value and support content creators. No corporate overlords collect taxes here. All the fees go to content creators, and to support the infrastructure behind the game.</Text>
          </Flex>

          <Flex direction={['column', 'row', 'row']} gap={['40px', '60px', '60px']}>
            <ImageFallback text='UI demo or illustration' minH={['501px', '0px', '0px']} minW={['100%', '0%', '0%']} flex='1'/>
            <Flex direction='column' gap='20px' textAlign='center' flex='1'>
              <Text fontWeight='700' fontSize='30px' lineHeight='120%'>Start your adventure</Text>
              <Text>Make a character or choose an existing character to add to the game’s lore.</Text> 
              <Text>Choose a  path to follow.  </Text>
              <Text>Create your own stories behind the paths you choose. Form alliances based on your choices. Convince other people to join your alliance, or trick them into choosing paths that end in despair.</Text>
              <Spacer />
            <Button 
                color='white' 
                w='100%' 
                bg='#EB8C6A' 
                _hover={{bg: '#EAA88F'}}
                borderRadius='30px'
                mb={['40px', '0', '0']}
                mt='20px'
                fontSize={['16px', '20px', '20px']}
                h={['40px', '46px', '46px']}


                >
                Make a character
            </Button>
                </Flex>
          </Flex>


            <Flex alignItems='center' bg='#EB8C6A' p='30px' borderRadius='20px' gap='20px' direction='column' textAlign='center'>
              <Text fontSize='30px' fontWeight='700' lineHeight='100%'>Join the Great Wyrm community to start the world building and be the first to play</Text>
              <Text>The game is now in early access. You can start creating your own content, making your own characters, forming alliances, or apply to be a Game Master.</Text>  
              <Button 
                color='black' 
                minW={['100%', '0', '0']} 
                bg='white' 
                _hover={{bg: '#EAA88F'}}
                borderRadius='30px'
                mt='20px'
                fontSize={['16px', '20px', '20px']}
                h={['40px', '46px', '46px']}
                p={['10px', '10px 80px', '10px 80px']}
              >
                Join
              </Button>
            </Flex>
            <Flex alignItems='center' bg='white' color='black' p='30px' borderRadius='20px' gap={['20px', '40px', '40px']} direction={['column', 'row', 'row']} textAlign='center'>
              <Text textAlign={['center', 'start', 'start']}>Learn more about crypto, NFT and DAOs, find links to educational resources, discuss gaming projects, and laugh at memes.   </Text>  
              <Button 
                color='#1A1D22' 
                minW={['100%', 'fit-content', 'fit-content']} 
                p={['10px', '10px 30px', '10px 30px']}

                bg='white' 
                _hover={{bg: '#EAA88F'}}
                borderRadius='30px'
                mt={['20px', '0', '0']}
                border='2px solid #1A1D22'
                onClick={() => window.open('https://discord.gg/K56VNUQGvA')}
                fontSize={['16px', '20px', '20px']}
                h={['40px', '46px', '46px']}

              >
                Join our Discord
              </Button>
            </Flex>
        </Flex>
      </Center>
    </Layout>
  )
}
