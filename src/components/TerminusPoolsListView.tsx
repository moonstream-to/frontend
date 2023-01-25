import { Button, Flex, Text } from '@chakra-ui/react'
import TerminusPoolsList from './TerminusPoolsList'

const TerminusPoolsListView = ({
  contractAddress,
  selected,
  onChange,
}: {
  contractAddress: string
  selected: string
  onChange: (id: string) => void
}) => {
  // const { contractAddress } = router.query;

  return (
    <Flex
      direction='column'
      bg='#2d2d2d'
      borderRadius='20px'
      gap='30px'
      p='30px'
      w='400px'
      h='500px'
      color='white'
    >
      <Text fontWeight='700' fontSize='24px'>
        All items
      </Text>
      <TerminusPoolsList
        contractAddress={contractAddress}
        onChange={onChange}
        selected={selected}
      />
      <Button
        width='100%'
        bg='gray.0'
        fontWeight='700'
        fontSize='20px'
        color='#2d2d2d'
      >
        + Add new
      </Button>
    </Flex>
  )
}

export default TerminusPoolsListView
