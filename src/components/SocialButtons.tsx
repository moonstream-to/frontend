import { Flex, Text, Image as ChakraImage} from "@chakra-ui/react"
import SocialButton from "./SocialButton"


const SocialButtons = ({...props}) => {
  const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`

  return (
    <Flex direction='column' gap='20px' fontSize='16px' fontWeight='700' {...props}>
      <Text fontWeight='semibold' textAlign='center' px='13px'>
        Follow Us
      </Text>
      <Flex width='158px' justifyContent='start'>
        <SocialButton label={'Discord'} href={'/discordleed'}>
          <ChakraImage maxW='26px' src={`${AWS_ASSETS_PATH}/icons/discord-logo.png`} />
        </SocialButton>
        <SocialButton label={'Twitter'} href={'https://twitter.com/moonstreamto'}>
          <ChakraImage maxW='24px' src={`${AWS_ASSETS_PATH}/icons/twitter-logo.png`} />
        </SocialButton>
      </Flex>
    </Flex>
  )
}

export default SocialButtons
