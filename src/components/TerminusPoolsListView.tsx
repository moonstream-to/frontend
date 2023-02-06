import { Flex, Text } from '@chakra-ui/react'
import TerminusPoolsList from './TerminusPoolsList'

const TerminusPoolsListView = ({
  contractAddress,
  selected,
  onChange,
}: {
  contractAddress: string
  selected: number
  onChange: (id: string, metadata: unknown) => void
}) => {
  return (
    <Flex direction='column' bg='#2d2d2d' borderRadius='20px' gap='30px' p='30px' w='400px' maxH='700px' color='white'>
      <Text fontWeight='700' fontSize='24px'>
        All pools
      </Text>
      <TerminusPoolsList contractAddress={contractAddress} onChange={onChange} selected={selected} />
      {/* <Button
        width='100%'
        bg='gray.0'
        fontWeight='700'
        fontSize='20px'
        color='#2d2d2d'
      >
        + Add new
      </Button> */}
    </Flex>
  )
}

export default TerminusPoolsListView
