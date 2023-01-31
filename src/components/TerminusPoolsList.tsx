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
import { MULTICALL2_CONTRACT_ADDRESSES } from '../constants'

const TerminusPoolsList = ({
  contractAddress,
  selected,
  onChange,
}: {
  contractAddress: string
  selected: number
  onChange: (id: string, metadata: unknown) => void
}) => {
  const web3ctx = useContext(Web3Context)

  const poolsList = useQuery(
    ['poolsList', contractAddress, web3ctx.chainId],
    async () => {
      const MULTICALL2_CONTRACT_ADDRESS = MULTICALL2_CONTRACT_ADDRESSES[String(web3ctx.chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES];
      if (!contractAddress || !MULTICALL2_CONTRACT_ADDRESS) { return }
      const terminusContract = new web3ctx.web3.eth.Contract(
        terminusAbi,
        contractAddress,
      ) as unknown as MockTerminus
      const multicallContract = new web3ctx.web3.eth.Contract(
        multicallABI,
        MULTICALL2_CONTRACT_ADDRESS,
      )
      const totalPools =  7 //await terminusContract.methods.totalPools().call()
      const uriQueries = []
      for (let i = 1; i <= Number(totalPools); i += 1) {
        uriQueries.push({
          target: contractAddress,
          callData: terminusContract.methods.uri(i).encodeABI(),
        })
      }
      return multicallContract.methods
        .tryAggregate(false, uriQueries)
        .call()
        .then((results: string[]) => {
          return results.map(
            (result) => {
              if (!web3ctx.web3.utils.hexToUtf8(result[1]).split('https://')[1]) { return undefined };
              return 'https://' +
              web3ctx.web3.utils.hexToUtf8(result[1]).split('https://')[1]
            }
          )
        }).then((parsedResults: string[]) => {
          return parsedResults;
        })
    },
    {
      ...queryCacheProps,
      // onSuccess: () => {},
    },
  )
  if (!poolsList.data) { return <Spinner />}

  return (
    <Flex direction='column' gap='15px' h='100%' overflowY='auto'>
      {poolsList.data.map((uri: string, idx: number) => (
        <TerminusPoolsListItem
          key={idx}
          address={contractAddress}
          poolId={String(idx + 1)}
          selected={(idx + 1) === selected}
          uri={uri}
          onChange={onChange}
        />
      ))}
    </Flex>
  )
}

export default TerminusPoolsList
