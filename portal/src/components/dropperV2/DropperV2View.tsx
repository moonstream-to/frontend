/* eslint-disable @typescript-eslint/no-var-requires */
import { useRouter } from "next/router";

import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Box, Button, Center, Flex, Input, Text, useToast } from "@chakra-ui/react";

import Layout from "../../../src/components/layout";
import DropperContractView from "../../../src/components/DropperContractView";
import Web3Context from "../../../src/contexts/Web3Context/context";
import useDropperContract from "../../../src/hooks/useDropper.sol";
import DropperClaimsListView from "../../../src/components/DropperClaimsListView";
import DropperClaimView from "../../../src/components/DropperClaimView";
import { TokenInterface } from "../../../src/types/Moonstream";
import useRecentAddresses from "../../../src/hooks/useRecentAddresses";
import ContractRow from "../../../src/components/ContractRow";
import DropperV2ContractView from "./DropperV2ContractView";
import DropperV2DropView from "./DropperV2DropView";

const DropperV2View = () => {
  const router = useRouter();
  const contractAddress =
    typeof router.query.contractAddress === "string" ? router.query.contractAddress : "";

  const web3ctx = useContext(Web3Context);

  const { contractState } = useDropperContract({ dropperAddress: contractAddress, ctx: web3ctx });
  const [selected, setSelected] = useState(-1);
  const [claimMetadata, setClaimMetadata] = useState<unknown>({});

  const handleClick = (claimId: string, metadata: unknown) => {
    setSelected(Number(claimId));
    setClaimMetadata(metadata);
  };
  const [nextValue, setNextValue] = useState(contractAddress);

  const toast = useToast();
  const { recentAddresses, addRecentAddress } = useRecentAddresses("dropper");

  useEffect(() => {
    if (!router.query.claimId) {
      setSelected(-1);
    } else {
      setSelected(Number(router.query.claimId));
    }
  }, [router.query.claimId]);

  useEffect(() => {
    if (contractAddress) {
      setNextValue(contractAddress);
    }
    setClaimMetadata({});
  }, [contractAddress]);

  const { chainId, web3, signAccessToken } = useContext(Web3Context);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (nextValue && web3.utils.isAddress(nextValue)) {
      handleSubmit();
    }
    queryClient.invalidateQueries("claimAdmin");
    queryClient.invalidateQueries("terminusAddresses");
    queryClient.invalidateQueries("claimants");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, web3ctx.account]);

  useEffect(() => {
    const token = localStorage.getItem("APP_ACCESS_TOKEN") ?? "";
    const stringToken = Buffer.from(token, "base64").toString("ascii");
    const account = web3ctx.account;
    const objectToken: TokenInterface =
      stringToken !== ""
        ? JSON.parse(`${stringToken}`)
        : { address: null, deadline: null, signed_message: null };
    const isOutdated = (deadline: number | string) => {
      if (!deadline) return true;
      if (Number(deadline) <= Math.floor(new Date().getTime() / 1000)) return true;
      return false;
    };

    if (web3?.utils.isAddress(account)) {
      if (
        objectToken?.address !== account ||
        isOutdated(objectToken?.deadline) ||
        !objectToken.signed_message
      ) {
        signAccessToken(account);
      }
    }
  }, [web3ctx.account]);

  const handleSubmit = () => {
    if (web3.utils.isAddress(nextValue)) {
      setClaimMetadata({});
      router.push({
        pathname: "/portal/dropperV2",
        query: {
          contractAddress: nextValue,
          claimId: router.query.claimId,
        },
      });
    } else {
      toast({
        render: () => (
          <Box borderRadius="5px" textAlign="center" color="black" p={1} bg="red.600">
            Invalid address
          </Box>
        ),
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Center>
      <Flex gap="30px" direction="column" px="7%" py="30px" color="white">
        <Flex gap="20px">
          <Input
            onKeyDown={handleKeyDown}
            w="50ch"
            placeholder="dropper contract address"
            type="text"
            value={nextValue}
            onChange={(e) => setNextValue(e.target.value)}
          />
          <Button
            bg="gray.0"
            fontWeight="400"
            fontSize="18px"
            color="#2d2d2d"
            onClick={handleSubmit}
          >
            Show
          </Button>
        </Flex>
        {contractAddress && (
          <>
            <DropperV2ContractView address={contractAddress} addRecentAddress={addRecentAddress} />
            <Flex gap="40px" maxH="700px">
              {contractState.data && (
                <DropperClaimsListView
                  contractAddress={contractAddress}
                  contractState={contractState}
                  onChange={handleClick}
                  selected={selected}
                  setSelected={setSelected}
                />
              )}
              {contractState.data && (
                <DropperV2DropView
                  address={contractAddress}
                  claimId={String(selected)}
                  metadata={claimMetadata}
                />
              )}
            </Flex>
          </>
        )}
        {!contractAddress && recentAddresses && (
          <Flex direction="column" gap="20px" bg="#2d2d2d" borderRadius="10px" p="20px">
            <Text>Recent</Text>
            {recentAddresses.map(({ address, chainId, name, image }) => (
              <ContractRow
                key={address}
                address={address}
                chainId={Number(chainId)}
                name={name}
                image={image}
                type="dropper"
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Center>
  );
};

export default DropperV2View;
