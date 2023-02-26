/* eslint-disable @typescript-eslint/no-var-requires */
import Head from 'next/head'

import { use, useContext, useEffect, useState } from 'react'
import { useQuery } from "react-query";
import { useRouter } from 'next/router'
import { Box, Button, Center, Flex, Input, Text, useToast } from '@chakra-ui/react'

import Layout from '../../../src/components/layout';
import Web3 from "web3";
import Web3Context from "../../../src/contexts/Web3Context/context";
const terminusAbi = require('../../../src/web3/abi/MockTerminus.json');
import { MockTerminus as TerminusFacet } from '../../../src/web3/contracts/types/MockTerminus';
const erc721Abi = require('../../../src/web3/abi/MockERC721.json');
import { MockERC721 as Erc721Facet } from '../../../src/web3/contracts/types/MockERC721';
import { hookCommon } from "../../../src/hooks";
// import useSpyMode from "../../../src/hooks/useSpyMode";
import NFTList from '../../../src/components/nft/NFTList';
import { NFTInfo } from '../../../src/components/nft/types';
import { MdOutlineStayCurrentLandscape } from 'react-icons/md';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const Inventory = () => {
  const router = useRouter();
  const queryAddress = router.query["spyAddress"] as string;

  const web3ctx = useContext(Web3Context);
  const [currentAccount, setCurrentAccount] = useState(ZERO_ADDRESS);

  useEffect(() => {
    let nextAddress = ZERO_ADDRESS;
    if (queryAddress && Web3.utils.isAddress(queryAddress)) {
      nextAddress = queryAddress;
    } else {
      nextAddress = web3ctx.account;
    }
    console.log("Next address:", nextAddress);
    if (Web3.utils.isAddress(nextAddress)) setCurrentAccount(nextAddress);
  }, [web3ctx.account, queryAddress]);

  const terminusAddress = "0x49ca1F6801c085ABB165a827baDFD6742a3f8DBc";
  const characterAddress = "0xDfbC5320704b417C5DBbd950738A32B8B5Ed75b3";

  type terminusType = "gamemaster" | "character_creation";
  const terminusTypes: terminusType[] = ["gamemaster", "character_creation"];
  const terminusPoolIds: { [key in terminusType]: number } = {
    gamemaster: 1,
    character_creation: 2,
  };

  const defaultBalances: { [key in terminusType]: number } = {
    gamemaster: 0,
    character_creation: 0,
  };

  const terminusBalances = useQuery(
    ['terminus_pools', currentAccount],
    async ({ queryKey }) => {
      const currentUserAddress = queryKey[1];

      if (currentUserAddress == "0x0000000000000000000000000000000000000000") {
        return;
      }

      const terminusFacet = new web3ctx.wyrmClient.eth.Contract(
        terminusAbi
      ) as any as TerminusFacet;
      terminusFacet.options.address = terminusAddress;

      const accounts: string[] = [];
      const poolIds: number[] = [];

      terminusTypes.forEach((terminusType) => {
        const pool = terminusPoolIds[terminusType];
        if (pool > 0) {
          accounts.push(`${currentUserAddress}`);
          poolIds.push(pool);
        }
      });

      const currentBalances = { ...defaultBalances };

      try {
        const balances = await terminusFacet.methods
          .balanceOfBatch(accounts, poolIds)
          .call();
        balances.forEach((balance, index) => {
          currentBalances[terminusTypes[index]] = parseInt(balance, 10);
        });
      } catch (e) {
        console.error(
          `Inventory: Could not retrieve terminus balances for the given user: ${currentUserAddress}. Terminus pool IDs: ${poolIds}. Terminus contract address: ${terminusAddress}.`
        );
      }

      console.log(currentBalances);
      return currentBalances;
    },
    {
      ...hookCommon,
    }
  );

  const characterList = useQuery<NFTInfo[]>(
    ["characters", characterAddress, currentAccount],
    async ({ queryKey }) => {
      const currentUserAddress = String(queryKey[2]);

      const inventory: NFTInfo[] = [];

      if (currentUserAddress == "0x0000000000000000000000000000000000000000") {
        return inventory;
      }

      const characterContract = new web3ctx.wyrmClient.eth.Contract(
        erc721Abi
      ) as unknown as Erc721Facet;
      characterContract.options.address = String(queryKey[1]);


      try {
        const numCharsRaw: string = await characterContract.methods
          .balanceOf(currentUserAddress)
          .call();

        let numChars = 0;
        try {
          numChars = parseInt(numCharsRaw, 10);
        } catch (e) {
          console.error(
            `Error: Could not parse number of owned characters as an integer: ${numCharsRaw}`
          );
        }

        const tokenIDPromises = [];
        for (let i = 0; i < numChars; i++) {
          tokenIDPromises.push(
            characterContract.methods
              .tokenOfOwnerByIndex(currentUserAddress, i)
              .call()
          );
        }
        const tokenIDs = await Promise.all(tokenIDPromises);

        const tokenURIPromises = tokenIDs.map((tokenID) =>
          characterContract.methods.tokenURI(tokenID).call()
        );
        const tokenURIs = await Promise.all(tokenURIPromises);

        const tokenMetadataPromises = tokenURIs.map((tokenURI) => {
          if(tokenURI && tokenURI.trim() != "") {
            return fetch(tokenURI, { cache: 'no-cache' }).then((response) => response.json());
          } else {
            return null;
          }
        });
        const tokenMetadata = await Promise.all(tokenMetadataPromises);

        const imageURIs = tokenMetadata.map((metadata) => metadata ? metadata.image: null);

        tokenIDs.forEach((tokenID, index) => {
          inventory.push({
            tokenID,
            tokenURI: tokenURIs[index],
            imageURI: imageURIs[index],
            metadata: tokenMetadata[index],
          });
        });
      } catch (e) {
        console.error(
          "There was an issue retrieving information about user's characters: "
        );
        console.error(e);
      }

      console.log(inventory);

      return inventory;
    },
    {
      ...hookCommon,
    }
  );

  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal - Inventory</title>
      </Head>
      <Box py={10}>
        <Flex ml="100px" flexDir="column">
          {terminusBalances.data && (
            <>
              <Text>Role:           
                {terminusBalances.data && terminusBalances.data['gamemaster'] > 0 ? (
                  " Game Master"
                ) : (
                  " Player"
                )}</Text>
              <Text>Character Creation tokens: {terminusBalances.data['character_creation']}</Text>
            </>
          )}
        </Flex>
        {characterList.data && (
          <NFTList nftList={characterList.data} />
        )}
      </Box>
    </Layout>
  )
}

export default Inventory;
