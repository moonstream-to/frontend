import { Flex, Text, Image as ChakraImage} from "@chakra-ui/react"
import SocialButton from "./SocialButton"


const SocialButtons = ({...props}) => {
  const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`

  return (
    <Flex direction='column' gap='20px' fontSize='16px' fontWeight='700' {...props}>
      <Text fontWeight='semibold' textAlign='center' px={{base: '0', sm: '13px'}}>
        Follow Us
      </Text>
      <Flex width='158px' justifyContent={{base: 'center', sm: 'start'}}>
        <SocialButton label={'Discord'} href={'https://discord.com/invite/knBnttUPqH'}>
          <ChakraImage filter='invert(1) invert(65%) sepia(81%) saturate(297%) hue-rotate(322deg) brightness(98%) contrast(96%)' maxW='26px' src={`${AWS_ASSETS_PATH}/icons/discord-logo.png`} />
        </SocialButton>
        <SocialButton label={'Twitter'} href={'https://twitter.com/GreatWyrm_RPG'}>
          <ChakraImage filter='invert(1) invert(65%) sepia(81%) saturate(297%) hue-rotate(322deg) brightness(98%) contrast(96%)' maxW='24px' src={`${AWS_ASSETS_PATH}/icons/twitter-logo.png`} />
        </SocialButton>
      </Flex>
    </Flex>
  )
}

export default SocialButtons
