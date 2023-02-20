/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, {  useContext, useEffect } from "react";
import Head from 'next/head'


import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Flex, Text } from "@chakra-ui/react";

import {
  useRouter,
} from '../../src/hooks';
import useGofp from "../../src/contexts/GoFPContext";
import Web3Context from "../../src/contexts/Web3Context/context";
import useGofpContract from "../../src/hooks/useGofpConract";
import VotingStagePanel from "../../src/components/gofp/VotingStagePanel";


const Voting = () => {
  const router = useRouter();
  
  const { gardenContractAddress, sessionId, setSessionId } = useGofp()
  const web3ctx = useContext(Web3Context)

  const {currentStage, sessionMetadata, correctPaths} = useGofpContract({
    sessionId, 
    gardenContractAddress,
    web3ctx,
  })

  useEffect(() => {
    setSessionId(router.query["sessionId"]) //TODO router.ready ?
  }, [])

  useEffect(() => {
    console.log(sessionMetadata.data)
    console.log(currentStage.data)
  }, [sessionMetadata.data, currentStage.data])

  const siteTitle = 'Moonstream apps portal'
  const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`



  return (
    <div>
      <Head>
        <link rel='icon' href='/favicon.png' />
        <meta
          name='description'
          content='Moonstream provides economic infrastructure for web3 games. Gather actionable data with our web3 data analytics. Act on it with our on-chain mechanics. Watch your economy flourish.'
        />
        <meta name='og:title' content={siteTitle} />
        <meta
          name='keywords'
          content='analytics, blockchain analytics, protocol, protocols, blockchain, crypto, data, NFT gaming, smart contracts, web3, smart contract, ethereum, polygon, matic, transactions, defi, finance, decentralized, mempool, NFT, NFTs, DAO, DAOs, cryptocurrency, cryptocurrencies, bitcoin, blockchain economy, blockchain game, marketplace, blockchain security, loyalty program, Ethereum bridge, Ethereum bridges, NFT game, NFT games'
        />
        <meta name='og:image' content={`${AWS_ASSETS_PATH}/metadata-image.png`} />
      </Head>
      <DndProvider backend={HTML5Backend}>
      {sessionMetadata.data && currentStage.data && (
      <Flex direction='column' gap='40px' px={{base: '16px'}} py={{base: '60px'}} color='white'>
        <Flex direction='column' border='1px solid #4d4d4d' borderRadius='10px' p='15px' gap='10px' fontSize='12px'>
          <Text fontWeight='700' fontSize='14px'>Session Lore</Text>
          <Text mb='10px'>{sessionMetadata.data.lore}</Text>
          <Text fontWeight='700' fontSize='14px'>Stage Lore</Text>
          <Text  mb='10px'>{sessionMetadata.data.stages[currentStage.data - 1].lore}</Text>
        </Flex>
        <Flex direction='column' border='1px solid #4d4d4d' borderRadius='10px' p='15px' gap='10px' fontSize='12px' mt='-20px'>
          <Text fontWeight='700' fontSize='14px'>About Great Wyrm</Text>
          <Text>Great Wyrm is the first fully decentralized RPG. It runs on the Garden of Forking Paths game mechanic. Great Wyrm is similar to choose-your-own-adventure gameplay, only in this case, there can be right and wrong choices. </Text>
          <Text>You can create your own stories behind paths you choose. Form alliances based on the chosen paths. Try to persuade other people to join your alliance or trick them into choosing a different path that doesn’t lead anywhere good. </Text>
        </Flex>
        <VotingStagePanel stage={currentStage.data} currentStage={currentStage.data} stageMetadata={sessionMetadata.data.stages[currentStage.data - 1]}/>
      </Flex>
      )}
      </DndProvider>
    </div>
  );
};

export default Voting;
