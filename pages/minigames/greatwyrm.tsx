import Head from 'next/head'

import { Button, Center, Flex, Image, Spacer, Text, useMediaQuery } from '@chakra-ui/react'

import Layout from '../../src/components/greatWyrm/layout'
import ImageFallback from '../../src/components/greatWyrm/ImageFallback'


const AWS_ASSETS_PATH = 'https://s3.amazonaws.com/static.simiotics.com/play/minigames/'
const assets = {
  coverLg: `${AWS_ASSETS_PATH}great-wyrm-cover-lg.png`,
  coverSm: `${AWS_ASSETS_PATH}great-wyrm-cover-sm.png`,
  coverMd: `${AWS_ASSETS_PATH}great-wyrm-cover-md.png`,
  logo: `${AWS_ASSETS_PATH}great-wyrm-logo.png`

}
const gradient = 'linear-gradient(180deg, rgba(26, 29, 34, 0) 63.89%, rgba(26, 29, 34, 0.0100738) 69.1%, rgba(26, 29, 34, 0.0386868) 73.45%, rgba(26, 29, 34, 0.0834265) 77.06%, rgba(26, 29, 34, 0.14188) 80.01%, rgba(26, 29, 34, 0.211635) 82.42%, rgba(26, 29, 34, 0.290279) 84.4%, rgba(26, 29, 34, 0.3754) 86.05%, rgba(26, 29, 34, 0.464584) 87.47%, rgba(26, 29, 34, 0.555419) 88.78%, rgba(26, 29, 34, 0.645493) 90.07%, rgba(26, 29, 34, 0.732393) 91.45%, rgba(26, 29, 34, 0.813706) 93.03%, rgba(26, 29, 34, 0.88702) 94.91%, rgba(26, 29, 34, 0.949922) 97.2%, #1A1D22 100%)'





export default function Home() {
  const [isVerySmallView] = useMediaQuery('(max-width: 450px)')
  const [isSmallView] = useMediaQuery('(max-width: 1023px)')
  const [is1440View] = useMediaQuery('(max-width: 1440px)')
  const [isBaseView] = useMediaQuery('(max-width: 768px)')


  return (
    <Layout home={true}>
      <Head>
        <title>great wyrm</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' 
          href='/favicon.png' //TODO
        />
      </Head>
      <Flex 
        w='100vw'
        position='relative'
        h={isBaseView ? 'calc(400px + 122 * (100vw -320px) / 768 )' : '66vw'}
        maxH='962'
        bgSize='cover' 
        bgPosition='center'
        resize='horizontal'
        backgroundImage={`${gradient}, url(${isVerySmallView ? assets.coverSm : (is1440View ? assets.coverMd : assets.coverLg)})`}
      >
        <Image 
          src={assets.logo} 
          w={{base: '150px', sm: '203px', l: '300px'}}
          alt=''
          position='absolute'
          top={{base: '20px', sm: '50px'}}
          mx='auto'
          left='0'
          right='0'
        />

      </Flex>
      <Center>
        <Flex fontFamily='Cinzel' maxW='1440px 'alignItems='center' gap={['40px', '80px', '80px', '160px']} py={['40px', '80px', '80px']} px={['22px', '54px', '54px', '72px', '101px']} w='100%' direction='column' fontSize={['16px', '18px', '18px']} lineHeight={['20px', '23px', '23px']}>

            <Flex flex='1' direction='column' gap={['20px', '20px', '40px']} textAlign={'center'} maxW='703px'>
              <Text fontWeight='700' fontSize={{base: '30px', sm:'40px', l: '50px'}} lineHeight='100%'>Enter the world of< br />Great Wyrm</Text>
              <Text>The only player-owned role-playing game in the world. Great Wyrm players have full control of the world we all play in.</Text>
              <Flex mt='20px' w={['100%']} direction={['column', 'row', 'row']} gap='20px' justifyContent='center' alignItems='center'>
                <Button 
                  variant='wyrmButton'
                  color='black' 
                  bg='linear-gradient(92.3deg, #EB8C6A 8.4%, #FFFFFF 126.31%)' 
                  _hover={{bg: 'linear-gradient(263.61deg, #EAA88F -6.84%, #FFFFFF 128.87%)'}}
                  >
                  Create a character
                </Button>
                <Button 
                  variant='wyrmButton'
                  minW={['100%', 'fit-content', 'fit-content']}
                  px={['0', '0', '30px']}
                  border='2px solid white'
                  bg='transparent'
                  onClick={() => window.open('https://discord.gg/K56VNUQGvA')}
                  _hover={{fontWeight: '700'}}
                  >
                  Join our discord
                </Button>
              </Flex>
            </Flex>




          <Flex direction='column' py='40px' px={['20px', '20px', '40px', '40px', '182px']} gap='30px' borderRadius='30px' border='1px solid white' textAlign='center'>
            <Text fontWeight='700' fontSize={['24px', '30px', '30px']} lineHeight='120%'>True Open Gaming License</Text>
            <Text>We value and support content creators. No corporate overlords collect taxes here. All the fees go to content creators, and to support the infrastructure behind the game.</Text>
          </Flex>

          <Flex direction={['column', 'row', 'row']} gap={['40px', '60px', '60px']}>
            <ImageFallback text='UI demo or illustration' minH={['501px', '0px', '0px']} minW={['100%', '0%', '0%']} flex='1'/>
            <Flex direction='column' gap='20px' textAlign={['center', 'center', 'start']} flex='1'>
              <Text fontWeight='700' fontSize={{base: '30px', l: '40px'}} lineHeight='120%'>Start your adventure</Text>
              <Text fontFamily='Inter' >Make a character or choose an existing character to add to the game’s lore.</Text> 
              <Text fontFamily='Inter' >Choose a  path to follow.  </Text>
              <Text fontFamily='Inter' >Create your own stories behind the paths you choose. Form alliances based on your choices. Convince other people to join your alliance, or trick them into choosing paths that end in despair.</Text>
              <Spacer />
            <Button 
                variant='wyrmButton'
                color='white' 
                bg='#EB8C6A' 
                _hover={{bg: '#EAA88F'}}
                mb={['40px', '0', '0']}
                mt='20px'
                >
                Make a character
            </Button>
                </Flex>
          </Flex>

          <Flex direction={['column', 'row', 'row']} gap={['40px', '60px', '60px']}>
            {isBaseView && <ImageFallback text='UI demo or illustration' minH={['501px', '0px', '0px']} minW={['100%', '0%', '0%']} flex='1'/>}
            <Flex direction='column' gap='20px' textAlign={['center', 'center', 'start']} flex='1'>
              <Text fontWeight='700' fontSize={{base: '30px', l: '40px'}} lineHeight='120%'>Become a Game Master</Text>
              <Text fontFamily='Inter' >If creating elaborate adventures for players to embark on is more your thing, become a Game Master.</Text> 
              <Text fontFamily='Inter' >Create new stories. Bring the content you&apos;ve already developed but haven&apos;t had a chance to play through. See ratings of how many people played your sessions.</Text>
              <Text fontFamily='Inter' >Alternatively, become a Lore Master to have the last say on which story lines become canon.</Text>
              <Spacer />
              <Button 
                  variant='wyrmButton'
                  color='white' 
                  bg='#EB8C6A' 
                  _hover={{bg: '#EAA88F'}}
                  mb={['40px', '0', '0']}
                  mt='20px'
                  >
                  Start creating
              </Button>
            </Flex>
            {!isBaseView && <ImageFallback text='UI demo or illustration' minH={['501px', '0px', '0px']} minW={['100%', '0%', '0%']} flex='1'/>}
          </Flex>

          <Flex direction={['column', 'row', 'row']} gap={['40px', '60px', '60px']}>
            <ImageFallback text='UI demo or illustration' minH={['501px', '0px', '0px']} minW={['100%', '0%', '0%']} flex='1'/>
            <Flex direction='column' gap='20px' textAlign={['center', 'center', 'start']} flex='1'>
              <Text fontWeight='700' fontSize={{base: '30px', l: '40px'}} lineHeight='120%'>Garden of  Forking Paths</Text>
              <Text fontFamily='Inter' >Great Wyrm runs on the Garden of Forking Paths, a platform which allows anybody to host and run multiplayer choose your own adventure games..</Text> 
              <Text fontFamily='Inter' >You can create content. You can commission content. You can sell and buy content without paying taxes to the game creators. </Text>
              <Spacer />
            <Button 
                variant='wyrmButton'
                color='white' 
                bg='#EB8C6A' 
                _hover={{bg: '#EAA88F'}}
                mb={['40px', '0', '0']}
                mt='20px'
                >
                Explore the story
            </Button>
                </Flex>
          </Flex>

          <Flex direction={['column', 'row', 'row']} gap={['40px', '60px', '60px']}>
            {isBaseView && <ImageFallback text='UI demo or illustration' minH={['501px', '0px', '0px']} minW={['100%', '0%', '0%']} flex='1'/>}
            <Flex direction='column' gap='20px' textAlign={['center', 'center', 'start']} flex='1'>
              <Text fontWeight='700' fontSize={{base: '30px', l: '40px'}} lineHeight='120%'>Nobody else sees this but you</Text>
              <Text fontFamily='Inter' fontWeight='700' >Are you at ETHDenver?</Text> 
              <Text fontFamily='Inter' >It&apos;s your chance to be a god in this story. Decide fates of Great Wyrm adventurers. Vote on each of their steps&apos; outcome. What will it be?</Text>
              <Spacer />
              <Button 
                  variant='wyrmButton'
                  color='white' 
                  bg='#EB8C6A' 
                  _hover={{bg: '#EAA88F'}}
                  mb={['40px', '0', '0']}
                  mt='20px'
                  >
                  Become a god
              </Button>
            </Flex>
            {!isBaseView && <ImageFallback text='UI demo or illustration' minH={['501px', '0px', '0px']} minW={['100%', '0%', '0%']} flex='1'/>}
          </Flex>


            <Flex alignItems='center' bg='#EB8C6A' p='30px' borderRadius='20px' gap={{base: '40px', l: '60px'}} direction={{base: 'column', l: 'row'}} textAlign={{base: 'center', l: 'left'}}>
              <Flex direction='column' gap='20px'>
                <Text fontSize='30px' fontWeight='700' lineHeight='120%'>Join the Great Wyrm community to start the world building and be the first to play</Text>
              </Flex>
              <Button 
                variant='wyrmButton'
                color='black' 
                bg='white' 
                _hover={{bg: '#EAA88F'}}
                p={['10px', '10px 80px', '10px 80px']}
              >
                Join
              </Button>
            </Flex>


            <Flex alignItems='center' bg='white' color='black' p='30px' borderRadius='20px' gap={['20px', '40px', '40px']} direction={['column', 'row', 'row']} textAlign='center'>
              <Text textAlign={['center']}>The game is now in early access. You can start creating your own content, making your own characters, forming alliances, or apply to be a Game Master.  </Text>  

            </Flex>
        </Flex>
      </Center>
    </Layout>
  )
}
