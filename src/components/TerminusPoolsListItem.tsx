import { useEffect } from 'react'

import useLink from '../hooks/useLink'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

const TerminusPoolsListItem = ({
  poolId,
  selected,
  onChange,
  uri,
}: {
  poolId: string
  address: string
  selected: boolean
  onChange: (id: string, metadata: unknown) => void
  uri: string
}) => {

  const metadata = useLink({ link: uri })

  const handleClick = () => {
    onChange(poolId, metadata.data)
  }

  useEffect(() => {
    if (selected) {
      onChange(poolId, metadata.data)
    }
  }, [selected, metadata, poolId, onChange])

  return (
    
    <Flex
      gap='15px'
      alignItems='center'
      bg={selected ? '#4d4d4d' : 'transparent'}
      fontWeight={selected ? '900' : '400'}
      borderRadius='10px'
      onClick={handleClick}
      cursor='pointer'
      p='10px'
    >
      {metadata.data && ( <>
        <Image
          src={metadata.data.image}
          width='32px'
          height='32px'
          alt={metadata.data.name}
          borderRadius='5px'
        />
        <Text unselectable='on'>{metadata.data.name}</Text>
      </>)}
      {!metadata.data?.image && ( <>
        <Box border='1px solid black' borderRadius='5px' w='32px' h='32px'/>
      </>)}
      {!metadata.data?.name && ( <>
        <Text borderRadius='5px' h='32px' flexGrow='1' textStyle='italic' color='gray'>no name</Text>
      </>)}
    </Flex>
  )
}

export default TerminusPoolsListItem
