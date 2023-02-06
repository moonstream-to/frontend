import React from 'react'
import { Text, Link, Box, Container, Stack, Image as ChakraImage, Flex, Spacer, useMediaQuery } from '@chakra-ui/react'
import RouterLink from 'next/link'
import { SITEMAP } from '../constants'
import SocialButton from './SocialButton'

const LINKS_SIZES = {
  fontWeight: '300',
  fontSize: 'md',
}

const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`
const PRIMARY_MOON_LOGO_URL = `${AWS_ASSETS_PATH}/moonstream-full-logo-2022.png`

const Footer = ({ home }: { home?: boolean }) => {
  const [isMobileView] = useMediaQuery('(max-width: 767px)')
  return (
    <Box textColor='white' borderTop='1px' borderColor='white' px='7%' mx='auto' minW='100vw'>
      <Container as={Stack} py={10} px='0px' maxW='1238px'>
        <Flex direction={['column', 'column', 'row']}>
          <Stack spacing={6}>
            <Box pb={isMobileView ? '40px' : '0px'}>
              {!home ? (
                <Link href='/' alignSelf='center'>
                  <ChakraImage alignSelf='center' w='160px' src={PRIMARY_MOON_LOGO_URL} alt='Go to app root' />
                </Link>
              ) : (
                <ChakraImage alignSelf='center' w='160px' src={PRIMARY_MOON_LOGO_URL} alt='Go to app root' />
              )}
            </Box>
            {!isMobileView && (
              <>
                <Flex justifyContent='start'>
                  <Link href='https://moonstream.to/privacy-policy'>Privacy policy</Link>
                  <Link href='https://moonstream.to/tos' ml='20px'>
                    Terms of Service
                  </Link>
                </Flex>
                <Text fontSize={'sm'}>© {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved</Text>
              </>
            )}
          </Stack>
          <Spacer />
          <Flex direction='column' pb={isMobileView ? '40px' : '0px'} ml={['0px', '0px', '5vw', '100px']}>
            <Text fontWeight='semibold' mb='20px'>
              Follow Us
            </Text>
            <Flex width='158px' justifyContent='space-between'>
              <SocialButton label={'Discord'} href={'/discordleed'}>
                <ChakraImage maxW='26px' src={`${AWS_ASSETS_PATH}/icons/discord-logo.png`} />
              </SocialButton>
              <SocialButton label={'Twitter'} href={'https://twitter.com/moonstreamto'}>
                <ChakraImage maxW='24px' src={`${AWS_ASSETS_PATH}/icons/twitter-logo.png`} />
              </SocialButton>
              <SocialButton label={'Github'} href={'https://github.com/bugout-dev/moonstream'}>
                <ChakraImage maxW='24px' src={`${AWS_ASSETS_PATH}/icons/github-logo.png`} />
              </SocialButton>
              <SocialButton label={'LinkedIn'} href={'https://www.linkedin.com/company/moonstream/'}>
                <ChakraImage maxW='24px' src={`${AWS_ASSETS_PATH}/icons/linkedin-logo.png`} />
              </SocialButton>
            </Flex>
          </Flex>
          <Flex justifyContent='space-between' pb={isMobileView ? '40px' : '0px'}>
            {Object.values(SITEMAP).map((category, colIndex) => {
              return (
                <Stack ml={['0px', '0px', '5vw', '100px']} align={'flex-start'} key={`footer-list-column-${colIndex}`}>
                  <>
                    <Text>{category.title}</Text>
                    {category.children.map((linkItem, linkItemIndex) => {
                      return (
                        <RouterLink passHref href={linkItem.path} key={`footer-list-link-item-${linkItemIndex}-col-${colIndex}`}>
                          <Text {...LINKS_SIZES}>{linkItem.title}</Text>
                        </RouterLink>
                      )
                    })}
                  </>
                </Stack>
              )
            })}
          </Flex>
          {isMobileView && <Text fontSize={'sm'}>© {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved</Text>}
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
