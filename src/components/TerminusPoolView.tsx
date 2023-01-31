/* eslint-disable @typescript-eslint/no-var-requires */
import Spinner from './Spinner/Spinner'
import { Flex, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'
import { useQuery } from 'react-query'
const terminusAbi = require('../web3/abi/MockTerminus.json')
const multicallABI = require('../web3/abi/Multicall2.json')
import { MockTerminus } from '../web3/contracts/types/MockTerminus'
import queryCacheProps from '../hooks/hookCommon'
import PoolDetailsRow from './PoolDetailsRow'
import { MULTICALL2_CONTRACT_ADDRESSES } from '../constants'
import Web3 from 'web3'


const TerminusPoolView = ({
  address,
  chainId,
  poolId,
  metadata,
}: {
  address: string
  chainId: string
  poolId: string
  metadata: any
}) => {

  const poolState = useQuery(
    ['poolState', address, poolId, chainId],
    async () => {
      
      const MULTICALL2_CONTRACT_ADDRESS = MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES];
      if (!address || !MULTICALL2_CONTRACT_ADDRESS) { return }      
      const web3 = new Web3();
      web3.setProvider(web3.eth.givenProvider);
      const terminusContract = new web3.eth.Contract(
        terminusAbi,
        address,
      ) as unknown as MockTerminus
      const multicallContract = new web3.eth.Contract(
        multicallABI,
        MULTICALL2_CONTRACT_ADDRESS,
      )
      const target = address
      const callDatas = []
      callDatas.push(
        terminusContract.methods.terminusPoolController(poolId).encodeABI(),
      )
      callDatas.push(
        terminusContract.methods.poolIsBurnable(poolId).encodeABI(),
      )
      callDatas.push(
        terminusContract.methods.poolIsTransferable(poolId).encodeABI(),
      )
      callDatas.push(
        terminusContract.methods.terminusPoolCapacity(poolId).encodeABI(),
      )
      callDatas.push(
        terminusContract.methods.terminusPoolSupply(poolId).encodeABI(),
      )
      callDatas.push(terminusContract.methods.uri(poolId).encodeABI())

      const queries = callDatas.map((callData) => {
        return {
          target,
          callData,
        }
      })
      return multicallContract.methods
        .tryAggregate(false, queries)
        .call()
        .then((results: string[][]) => {
          const parsedResults = results.map((result: string[], idx: number) => {
            let parsed = web3.utils.hexToNumberString(result[1])
            if (idx === 0) {
              const adr = '0x' + result[1].slice(-40)
              parsed = web3.utils.toChecksumAddress(adr)
            }
            if (idx === 5) {
              if (!web3.utils.hexToUtf8(result[1]).split('https://')[1]) { return undefined };
              parsed =
                'https://' +
                web3.utils.hexToUtf8(result[1]).split('https://')[1]
            }
            return parsed
          })
          const data = {
            controller: parsedResults[0],
            isBurnable: parsedResults[1],
            isTransferable: parsedResults[2],
            capacity: String(parsedResults[3]),
            supply: parsedResults[4],
            uri: parsedResults[5],
          }
          return data
        })
    },
    {
      ...queryCacheProps,
      // onSuccess: () => {},
    },
  )



  return (
    <Flex
      bg='#2d2d2d'
      minW='800px'
      borderRadius='20px'
      p='30px'
      color='white'
      direction='column'
      maxW='800px'
      
    >
      {!!poolState.data && (
        <>
          <Text fontWeight='700' fontSize='24px' mb='20px'>
            {metadata?.name ?? ''}
          </Text>
          <Flex direction='column' gap='20px' overflowY='auto'>
            <Flex gap='20px'>
              {metadata?.image && <Image
                w='140px'
                h='140px'
                borderRadius='20px'
                src={metadata.image}
                alt='image'
              /> }

              <Text fontWeight='400' fontSize='18px'>
                {metadata?.description ?? ''}
              </Text>
            </Flex>
            <Flex
              direction='column'
              gap='10px'
              p={5}
              borderRadius='10px'
              bg='#232323'
            >

              <PoolDetailsRow type='controller' value={poolState.data.controller} />
              <PoolDetailsRow type='capacity' value={poolState.data.capacity} />
              <PoolDetailsRow type='supply' value={poolState.data.supply} />
              <PoolDetailsRow type='burnable' value={poolState.data.isBurnable ? 'true' : 'false'} />
              <PoolDetailsRow type='transferable' value={poolState.data.isTransferable ? 'true' : 'false'} />
              <PoolDetailsRow type='uri' value={poolState.data.uri} />
              
              {metadata?.attributes  && (

                <>
                  <Text fontWeight='700' mt='20px'>Metadata:</Text>
              
                  {metadata.attributes.map(
                    (attribute: { trait_type: string; value: string }) => (
                      <PoolDetailsRow key={attribute.trait_type} type={attribute.trait_type} value={String(attribute.value)} />
                    ),
                  )}
                </>
              )}
            </Flex>
          </Flex>
        </>
      )}
      {!poolState.data && (
        <Flex alignItems='center' justifyContent='center' h='100%'>
          <Spinner h='50px' w='50px'/>
        </Flex>
      )}
    </Flex>
  )
}

export default TerminusPoolView
