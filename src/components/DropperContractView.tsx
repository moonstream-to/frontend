/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { Flex, Text } from "@chakra-ui/layout";

import PoolDetailsRow from "./PoolDetailsRow";
import Web3Context from "../contexts/Web3Context/context";

import useDropperContract from "../hooks/useDropper.sol";

const DropperContractView = ({
  address,
  addRecentAddress,
}: {
  address: string;
  addRecentAddress: (address: string, fields: Record<string, string>) => void;
}) => {
  const errorDialog = [
    "Something is wrong. Is MetaMask connected properly to the right chain?",
    "Is contract address correct?",
    `Then I don't know. Maybe you should try later`,
  ];
  const [dialogStep, setDialogStep] = useState(0);
  const nextStep = () => {
    setDialogStep((prev) => Math.min(prev + 1, errorDialog.length - 1));
  };
  const web3ctx = useContext(Web3Context);
  const { contractState } = useDropperContract({ ctx: web3ctx, dropperAddress: address });
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => setIsTimeout(true), 9000);
    return () => clearTimeout(timeOutId);
  }, [address]);

  useEffect(() => {
    setIsTimeout(false);
  }, [address]);

  useEffect(() => {
    if (contractState.data?.owner) {
      addRecentAddress(address, { chainId: String(web3ctx.chainId) });
    }
  }, [contractState.data]);

  return (
    <>
      <Flex bg="#2d2d2d" maxW="1240px" borderRadius="20px" p="30px" direction="column" gap="20px">
        <Flex gap="30px">
          {contractState.data?.owner && (
            <Flex
              flex="1 1 0px"
              direction="column"
              gap="10px"
              p={5}
              borderRadius="10px"
              bg="#232323"
            >
              <PoolDetailsRow
                type={"Owner"}
                value={
                  contractState.data.owner +
                  (web3ctx.account === contractState.data.owner ? " (you)" : "")
                }
                displayFull={true}
              />
              <PoolDetailsRow type={"Number of drops"} value={contractState.data.numClaims} />

              <PoolDetailsRow type={"Active"} value={String(!contractState.data.paused)} />
            </Flex>
          )}
          {!contractState.data?.owner && isTimeout && (
            <Flex alignItems="center" gap="10px" color="gray.900">
              <Text fontStyle="italic" color="gray.900">
                {errorDialog[dialogStep]}
              </Text>
              {dialogStep < errorDialog.length - 1 && (
                <Text
                  cursor="pointer"
                  h="fit-content"
                  p="2px 12px"
                  border="1px solid gray"
                  borderRadius="5px"
                  bg="transparent"
                  onClick={nextStep}
                >
                  Yes
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default DropperContractView;
