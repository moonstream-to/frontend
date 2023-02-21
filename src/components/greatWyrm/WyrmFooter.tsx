import React from 'react'

import { Text, Link, Flex, useMediaQuery } from '@chakra-ui/react'

import SocialButtons from '../SocialButtons'


const Footer = ({ home }: { home?: boolean }) => {
  const [isMobileView] = useMediaQuery('(max-width: 767px)')
  const [is768View] = useMediaQuery('(max-width: 1023px)')

  return (
      <>
        {isMobileView && (
          <Flex justifyContent='space-between' direction='column' gap='40px' p='40px 18px' fontSize='14px' borderTop='1px solid white' alignItems='center'>
            <Text fontWeight='700' fontSize='30px'>great wyrm</Text>
            <SocialButtons />
            <Flex justifyContent='center'>
              <Link href='https://moonstream.to/privacy-policy'>Privacy policy</Link>
              <Link href='https://moonstream.to/tos' ml='20px'>Terms of Service</Link>
            </Flex>
            <Text mt='-20px'>© {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved</Text>
          </Flex>
        )}
        {!isMobileView && (
          <Flex justifyContent='space-between' alignItems={['', '', '', '', 'center', 'center']} direction='column' gap='40px' p={['40px 22px', '40px 54px', '40px 54px']} borderTop='1px solid white'>
              <Flex justifyContent='space-between' maxW={['', '', '', '', '1238px']} minW={['', '', '', '', '1238px']} flexShrink='0'>
                <Flex direction='column' justifyContent='space-between'>
                  <Text fontWeight='700' fontSize='30px'>great wyrm</Text>
                  <Flex gap='20px'>
                    <Link href='https://moonstream.to/privacy-policy'>Privacy policy</Link>
                    <Link href='https://moonstream.to/tos' ml='20px'>Terms of Service</Link>
                  </Flex>
                </Flex>
                {!is768View && (
                  <Flex direction='column' justifyContent='end'>
                    <Text textAlign='center' fontSize='14px'>© {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved</Text>
                  </Flex>

                  )}
                <SocialButtons alignItems='start' />
              </Flex>
              {is768View && (
                <Text textAlign='center' fontSize='14px'>© {new Date().getFullYear()} Moonstream.to All&nbsp;rights&nbsp;reserved</Text>
              )}
          </Flex>
        )}

      </>
    )
}

export default Footer
