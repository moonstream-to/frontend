import { Flex, Spinner } from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import Web3Context from '../contexts/Web3Context/context'
import useTerminusContract from '../hooks/useTerminusContract'
import TerminusPoolsListItem from './TerminusPoolsListItem'

const TerminusPoolsList = ({
  contractAddress,
  selected,
  onChange,
}: {
  contractAddress: string
  selected: string
  onChange: (id: string) => void
}) => {
  const web3ctx = useContext(Web3Context)
  const terminus = useTerminusContract({
    address: contractAddress,
    ctx: web3ctx,
  })
  const [poolIDs, setPoolIDs] = useState<string[]>([])
  // const [selected, setSelected] = useState(1)
  useEffect(() => {
    if (terminus.contractState.data) {
      const newIDs = []
      for (
        let i = 1;
        i <= 20; //Number(terminus.contractState.data?.totalPools);
        i += 1
      ) {
        newIDs.push(String(i))
      }
      setPoolIDs(newIDs)
    }
  }, [terminus.contractState.data])

  if (terminus.contractState.isLoading || !terminus.contractState.data)
    return <Spinner />

  return (
    <Flex direction='column' gap='15px' h='100%' overflowY='auto'>
      {poolIDs.map((poolId) => (
        <TerminusPoolsListItem
          key={poolId}
          address={contractAddress}
          poolId={poolId}
          selected={poolId === selected}
          onChange={onChange}
        />
      ))}
    </Flex>
  )
}

export default TerminusPoolsList
