import React from 'react'

import { Text, Link, Image as ChakraImage, Flex, useMediaQuery } from '@chakra-ui/react'

import SocialButton from '../SocialButton'

const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`

const Footer = ({ home }: { home?: boolean }) => {
  const [isMobileView] = useMediaQuery('(max-width: 767px)')
  return (
    <Flex direction='column' gap='40px' p='40px 18px' borderTop='1px solid white' alignItems='center'>
      <Text fontWeight='700' fontSize='30px'>great wyrm</Text>
      <Flex direction='column' gap='20px'>
        <Text fontWeight='semibold' textAlign='center'>
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
      <Flex direction='column' gap='20px'  fontSize='14px'>
        <Flex justifyContent='center'>
                  <Link href='https://moonstream.to/privacy-policy'>Privacy policy</Link>
                  <Link href='https://moonstream.to/tos' ml='20px'>
                    Terms of Service
                  </Link>
        </Flex>
        <Text>© {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved</Text>
      </Flex>
    </Flex>

  )
}

export default Footer
