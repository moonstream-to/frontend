/* eslint-disable @typescript-eslint/no-var-requires */
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useContext, useEffect, useState } from 'react'
import { useQuery } from "react-query";
import { Box, Button, Center, Flex, Input, Text, useToast } from '@chakra-ui/react'

import Layout from '../../../src/components/layout';
import Web3 from "web3";
import Web3Context from "../../../src/contexts/Web3Context/context";
const terminusAbi = require('../../../src/web3/abi/MockTerminus.json');
import { MockTerminus as TerminusFacet } from '../../../src/web3/contracts/types/MockTerminus';
import { hookCommon } from "../../../src/hooks";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const Inventory = () => {
  const router = useRouter();
  const web3ctx = useContext(Web3Context);

  const [currentAccount, setCurrentAccount] = useState(ZERO_ADDRESS);
  useEffect(() => {
    if (Web3.utils.isAddress(web3ctx.account)) setCurrentAccount(web3ctx.account);
  }, [web3ctx.account]);

  const terminusAddress = "0x49ca1F6801c085ABB165a827baDFD6742a3f8DBc";
  type terminusType = "type1" | "type2";
  const terminusTypes: terminusType[] = ["type1", "type2"];
  const terminusPoolIds: { [key in terminusType]: number } = {
    type1: 1,
    type2: 2,
  };

  const defaultBalances: { [key in terminusType]: number } = {
    type1: 0,
    type2: 0,
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

  return (
    <Layout home={true}>
      <Head>
        <title>Moonstream portal - Inventory</title>
      </Head>
      <Center>
      </Center>
    </Layout>
  )
}

export default Inventory;
