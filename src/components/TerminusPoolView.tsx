import { useContext } from 'react'
import Web3Context from '../contexts/Web3Context/context'
import useTerminusContract from '../hooks/useTerminusContract'
import useLink from '../hooks/useLink'
import { Spinner } from '@chakra-ui/spinner'
import { Flex, Link, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'

const TerminusPoolView = ({
  address,
  poolId,
}: {
  address: string
  poolId: string
}) => {
  const web3ctx = useContext(Web3Context)
  const { poolState } = useTerminusContract({
    address,
    poolId,
    ctx: web3ctx,
  })
  const uri = useLink({ link: poolState.data?.uri })

  if (!poolState.data) {
    return <Spinner />
  }

  if (!uri.data) {
    return <div>Controller: {poolState.data.controller}</div>
  }

  return (
    <Flex
      bg='#2d2d2d'
      w='100%'
      borderRadius='20px'
      p='30px'
      gap={10}
      color='white'
      maxH='500px'
    >
      <Image
        w='140px'
        h='140px'
        borderRadius='20px'
        src={uri.data.image}
        alt={uri.data.name}
      />
      <Flex direction='column' gap='20px'>
        <Text fontWeight='700' fontSize='24px'>
          {uri.data.name}
        </Text>
        <Text fontWeight='400' fontSize='18px'>
          {uri.data.description}
        </Text>
        <Text fontWeight='400' fontSize='18px'>
          Pool controller: {poolState.data.controller}
        </Text>
        <Link href={poolState.data.uri} fontWeight='400' fontSize='18px'>
          URI: {poolState.data.uri}
        </Link>
        <Text>
          {poolState.data.isBurnable === false
            ? 'Nonburnable'
            : poolState.data.isBurnable
              ? 'Burnable'
              : 'N/A'}
        </Text>
        <Text>
          {poolState.data.isTransferable === false
            ? 'Nontransferable'
            : poolState.data.isTransferable
              ? 'Transferable'
              : 'N/A'}
        </Text>
        <Text fontWeight='400' fontSize='14px' overflow='clip'>
          Capacity: {poolState.data.capacity}
        </Text>
        <Text fontWeight='400' fontSize='14px'>
          Supply: {poolState.data.supply}
        </Text>

        <Flex
          direction='column'
          gap='10px'
          p={5}
          borderRadius='10px'
          bg='#232323'
        >
          {uri.data.attributes.map(
            (attribute: { trait_type: string; value: string }) => (
              <Text fontWeight='400' fontSize='18px' key={attribute.trait_type}>
                {attribute.trait_type}: {attribute.value}
              </Text>
            ),
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TerminusPoolView
