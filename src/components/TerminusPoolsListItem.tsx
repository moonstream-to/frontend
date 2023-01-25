import { useContext } from 'react'
import Web3Context from '../contexts/Web3Context/context'
import useTerminusContract from '../hooks/useTerminusContract'
import useLink from '../hooks/useLink'
import { Spinner } from '@chakra-ui/spinner'
import { Flex } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

const TerminusPoolsListItem = ({
  poolId,
  address,
  selected,
  onChange,
}: {
  poolId: string
  address: string
  selected: boolean
  onChange: (id: string) => void
}) => {
  const web3ctx = useContext(Web3Context)
  const { poolState } = useTerminusContract({
    address,
    poolId,
    ctx: web3ctx,
  })
  const uri = useLink({ link: poolState.data?.uri })

  const handleClick = () => {
    onChange(poolId)
  }
  if (!poolState.data) {
    return <Spinner />
  }
  if (!uri.data) {
    return <div>no data</div>
  }
  return (
    <Flex
      gap='15px'
      alignItems='center'
      bg={selected ? '#4d4d4d' : 'transparent'}
      onClick={handleClick}
      cursor='pointer'
    >
      <Image
        src={uri.data.image}
        width='32px'
        height='32px'
        alt={uri.data.name}
        borderRadius='5px'
      />
      <div>{uri.data.name}</div>
    </Flex>
  )
}

export default TerminusPoolsListItem
