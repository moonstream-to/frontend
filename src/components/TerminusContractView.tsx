/* eslint-disable @typescript-eslint/no-var-requires */
import { Box, Flex, Spacer, Text } from "@chakra-ui/layout";
import { useQuery } from "react-query";
import queryCacheProps from "../hooks/hookCommon";
const terminusAbi = require('../web3/abi/MockTerminus.json')
const multicallABI = require('../web3/abi/Multicall2.json')
import { MockTerminus } from '../web3/contracts/types/MockTerminus'
import { useContext, useState } from "react";
import useURI from "../hooks/useLink";
import PoolDetailsRow from "./PoolDetailsRow";
import { Image } from "@chakra-ui/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { MULTICALL2_CONTRACT_ADDRESSES } from "../constants";
import Web3Context from "../contexts/Web3Context/context";



const TerminusContractView = ({address} : {address: string}) => {
  const headerMeta = ['name', 'description', 'image'];
  const [uri, setURI] = useState<string | undefined>(undefined);
  const metadata = useURI({link: uri});
  const {web3, chainId} = useContext(Web3Context);

  const contractState = useQuery(
    ['contractState', address, chainId],
    async() => {
      const MULTICALL2_CONTRACT_ADDRESS = MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES];
      if (!address || !MULTICALL2_CONTRACT_ADDRESS) { return }
      const terminusContract = new web3.eth.Contract(
        terminusAbi,
        address,
      ) as unknown as MockTerminus
      const target = address;
      const callDatas = [];
      callDatas.push(terminusContract.methods.poolBasePrice().encodeABI());
      callDatas.push(terminusContract.methods.paymentToken().encodeABI());
      callDatas.push(terminusContract.methods.contractURI().encodeABI());
      callDatas.push(terminusContract.methods.totalPools().encodeABI());
      callDatas.push(terminusContract.methods.terminusController().encodeABI());
      const queries = callDatas.map((callData) => {
        return {
          target,
          callData,
        }
      })


      const multicallContract = new web3.eth.Contract(
        multicallABI,
        MULTICALL2_CONTRACT_ADDRESS
      )




      return multicallContract.methods
        .tryAggregate(false, queries)
        .call()
        .then((results: string[]) => {
          const parsedResults = results.map((result: string, idx: number) => {
            let parsed = web3.utils.hexToNumberString(result[1])
            if (idx === 4 || idx === 1) {
              const adr = '0x' + result[1].slice(-40)
              parsed = web3.utils.toChecksumAddress(adr)
            }
            if (idx === 2) {
              if (!web3.utils.hexToUtf8(result[1]).split('https://')[1]) { return undefined };
              parsed =
              'https://' +
              web3.utils.hexToUtf8(result[1]).split('https://')[1]
            }
            return String(parsed);
          })
          const data = {
            poolBasePrice: parsedResults[0],
            paymentToken: parsedResults[1],
            contractURI: parsedResults[2],
            totalPools: parsedResults[3],
            controller: parsedResults[4],
          }
          setURI(data.contractURI);
          return data
        })
    },
    {
      ...queryCacheProps,
      // onSuccess: () => {},
    },
  );
  return (
    <>
      {contractState.data && (
        <Flex
          bg='#2d2d2d'
          maxW='1240px'
          borderRadius='20px'
          p='30px'
          direction='column'
          gap='20px'
        >
          {metadata.data && <Text fontWeight='700' fontSize='24px'>{metadata.data.name}</Text>}
          <Flex gap='30px'>
            {metadata.data && (
              <Flex gap='20px' flex='1 1 0px'>
                <Image src={metadata.data.image} alt='contract image' w='140px' h='140px' />
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                  {metadata.data.description}
                </ReactMarkdown>
              </Flex>
            )}
            <Flex
              flex='1 1 0px'
              direction='column'
              gap='10px'
              p={5}
              borderRadius='10px'
              bg='#232323'
            >
              <PoolDetailsRow type={'URI'} value={contractState.data.contractURI} />
              <PoolDetailsRow type={'Number of pools'} value={contractState.data.totalPools} />

              <PoolDetailsRow type={'Payment token'} value={contractState.data.paymentToken} />
              <PoolDetailsRow type={'Pool base price'} value={Number(contractState.data.poolBasePrice).toLocaleString('en-US')} />
              <PoolDetailsRow type={'Contract controller'} value={contractState.data.controller} />
              {metadata.data && (
                <Accordion allowMultiple>
                  <AccordionItem border="none">

                    <AccordionButton p='0' mb='10px'>
                      <Spacer />
                      <Box as="span" flex='1' textAlign='right' pr='10px' fontWeight='700'>
                          Metadata
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      {Object.keys(metadata.data).filter((key) => !headerMeta.includes(key)).map((key) => {
                        return <PoolDetailsRow key={key} type={key} value={String(metadata.data[key])} />
                      })}
                    </AccordionPanel>
                  </AccordionItem>
                  {/* <AccordionItem border="none">

                    <AccordionButton p='0'>
                      <Spacer />
                      <Box as="span" flex='1' textAlign='right' pr='10px' fontWeight='700'>
                        Analytics
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel textAlign='center'>
                      <Text fontWeight='200' fontStyle='italic'>Coming soon ... </Text>
                    </AccordionPanel>
                  </AccordionItem> */}
                </Accordion>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>

  );
};


export default TerminusContractView
