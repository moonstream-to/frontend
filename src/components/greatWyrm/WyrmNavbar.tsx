import { Text } from "@chakra-ui/react"

const WyrmNavbar = ({...props}: {[x: string]: any}) => {
  return (
    <Text p='12px 22px' fontWeight='700' fontSize='24px' lineHeight='120%' {...props} borderBottom='1px solid white'>great wyrm</Text>
  )
}

export default WyrmNavbar
