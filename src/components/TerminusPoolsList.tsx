/* eslint-disable @typescript-eslint/no-var-requires */
import { Flex } from '@chakra-ui/react'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import Web3Context from '../contexts/Web3Context/context'
import queryCacheProps from '../hooks/hookCommon'
import TerminusPoolsListItem from './TerminusPoolsListItem'

const terminusAbi = require('../web3/abi/MockTerminus.json')
const multicallABI = require('../web3/abi/Multicall2.json')
import { MockTerminus } from '../web3/contracts/types/MockTerminus'
import Spinner from './Spinner/Spinner'
import { MAX_INT, MULTICALL2_CONTRACT_ADDRESSES } from '../constants'

const TerminusPoolsList = ({
  contractAddress,
  selected,
  onChange,
  filter,
}: {
  contractAddress: string
  selected: number
  onChange: (id: string, metadata: unknown) => void
  filter: string
}) => {
  const { chainId, web3 } = useContext(Web3Context)

  const poolsList = useQuery(
    ['poolsList', contractAddress, chainId],
    async () => {
      const MULTICALL2_CONTRACT_ADDRESS = MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES]
      if (!contractAddress || !MULTICALL2_CONTRACT_ADDRESS) {
        return
      }
      const terminusContract = new web3.eth.Contract(terminusAbi, contractAddress) as unknown as MockTerminus
      const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS)
      const LIMIT = Number(MAX_INT)
      let totalPools
      try {
        totalPools = await terminusContract.methods.totalPools().call()
      } catch (e) {
        console.log(e)
        totalPools = 0
      }

      const uriQueries = []
      for (let i = 1; i <= Math.min(LIMIT, Number(totalPools)); i += 1) {
        uriQueries.push({
          target: contractAddress,
          callData: terminusContract.methods.uri(i).encodeABI(),
        })
      }
      return multicallContract.methods
        .tryAggregate(false, uriQueries)
        .call()
        .then((results: string[]) => {
          return results.map((result) => {
            let parsed
            try {
              parsed = web3.utils.hexToUtf8(result[1]).split('https://')[1]
              if (!parsed) {
                throw 'not an address'
              }
              parsed = 'https://' + parsed
            } catch (e) {
              console.log(e)
              parsed = undefined
            }
            return parsed
          })
        })
        .then((parsedResults: string[]) => {
          return parsedResults
        })
    },
    {
      ...queryCacheProps,
      // onSuccess: () => {}, //TODO
    },
  )



  if (!poolsList.data) {
    return <Spinner />
  }

  return (
    <Flex direction='column' gap='15px' h='100%' overflowY='auto'>
      {poolsList.data.map((uri: string, idx: number) => (
        <TerminusPoolsListItem
          key={idx}
          address={contractAddress}
          poolId={String(idx + 1)}
          selected={idx + 1 === selected}
          uri={uri}
          onChange={onChange}
          filter={filter}
        />
      ))}
    </Flex>
  )
}

export default TerminusPoolsList
