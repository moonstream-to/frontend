import { Flex, Image, Text } from "@chakra-ui/react"

const ImageFallback = ({text = '', image = '', ...props }) => {
  return (
    <Flex borderRadius='20px' bg='#4D4D4D' color='#BFBFBF' alignItems='center' justifyContent='center' minW='100%' {...props} >
      {image && <Image src={image} 
        alt=''  //TODO - size 
      />}  
      {!image && text && <Text fontSize='18px'>{text}</Text> }
    </Flex>
  )
}

export default ImageFallback
