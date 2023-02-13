import { Flex, Image, Text } from "@chakra-ui/react"
import { useRouter } from 'next/router'

import { chainByChainId } from '../contexts/Web3Context'


const ContractCard = ({image, name, address, chainId}: {image: string; name: string; address: string; chainId: number}) => {
  const router = useRouter()
  const handleClick = () => {
    router.push({
      pathname: '/terminus',
      query: {
        contractAddress: address,
      },
    })
  }
  return (
    <Flex onClick={handleClick} w='220px' direction='column' p={5} gap={5} bg='#353535' borderRadius='20px' color='white'>
      <Image alt='' src={image} minH='180px' maxH='180px' minW='180px' borderRadius='10px' />
      <Text fontSize='16px' fontWeight='700'>{name}</Text>
      <Flex wrap='wrap' fontFamily='mono' fontSize='12px' direction='column' bg='#232323' borderRadius='10px' p={2} gap={1}>
        <Text >Address: {address.slice(0, 6) + '...' + address.slice(-4)}</Text>
        <Text>Network: {chainByChainId[chainId]}</Text>
      </Flex>
    </Flex>
  )
}

export default ContractCard
