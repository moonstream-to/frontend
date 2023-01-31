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
      onClick={handleClick}
      cursor='pointer'
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
      {!metadata.data && ( <>
        <Box w='32px' h='32px' color='#4d4d4d' opacity='0.2' />
      </>)}
    </Flex>
  )
}

export default TerminusPoolsListItem
