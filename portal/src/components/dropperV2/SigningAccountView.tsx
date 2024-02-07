import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import AuthorizationInfo from "./AuthorizationInfo";
import Web3Address from "../entity/Web3Address";
import styles from "./SigningAccountView.module.css";

import { AbiItem } from "web3-utils";
import importedTerminusAbi from "../../web3/abi/MockTerminus.json";
const terminusAbi = importedTerminusAbi as unknown as AbiItem[];
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import CheckOnShieldIcon from "../icons/CheckOnShieldIcon";
import ErrorOnShieldIcon from "../icons/ErrorOnShieldIcon";
import RadioButtonSelected from "../icons/RadioButtonSelected";
import RadioButtonNotSelected from "../icons/RadioButtonNotSelected";

const SigningAccountView = ({
  selectedSignerAccount,
  setSelectedSignerAccount,
  signingAccount,
  dropAuthorization,
}: {
  selectedSignerAccount: { subdomain: string; address: string } | undefined;
  setSelectedSignerAccount: (arg0: { subdomain: string; address: string }) => void;
  signingAccount: {
    subdomain: string;
    address: string;
    tokensNumber: number;
  };
  dropAuthorization: { poolId: string; terminusAddress: string };
}) => {
  const { chainId, web3, account } = useContext(Web3Context);
  const queryClient = useQueryClient();
  const [updatedBalance, setUpdatedBalance] = useState(-1);
  const terminusFacet = new web3.eth.Contract(terminusAbi) as any as MockTerminus;
  terminusFacet.options.address = dropAuthorization.terminusAddress;
  useEffect(() => {
    setUpdatedBalance(Number(signingAccount.tokensNumber));
  }, [signingAccount.tokensNumber]);

  const terminusInfo = useQuery(["terminusPoolState", dropAuthorization], async () => {
    const contractController = await terminusFacet.methods.terminusController().call();
    const poolController = await terminusFacet.methods
      .terminusPoolController(dropAuthorization.poolId)
      .call();
    return { contractController, poolController };
  });
  const mintTokens = useMutation(
    ({ to, poolID, amount }: { to: string; poolID: number; amount: number }) =>
      terminusFacet.methods
        .mint(to, poolID, amount, "0x0")
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    {
      onSuccess: () => {
        setUpdatedBalance(updatedBalance + 1);
        queryClient.invalidateQueries("signing_server");
      },
    },
  );
  const burnTokens = useMutation(
    ({ from, poolID, amount }: { from: string; poolID: number; amount: number }) =>
      terminusFacet.methods
        .burn(from, poolID, amount)
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    {
      onSuccess: () => {
        setUpdatedBalance(updatedBalance - 1);
        queryClient.invalidateQueries("signing_server");
      },
    },
  );

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Flex
        alignItems={"center"}
        gap={"10px"}
        onClick={() => setSelectedSignerAccount(signingAccount)}
        cursor={"pointer"}
        w={"156px"}
      >
        {selectedSignerAccount?.address === signingAccount.address ? (
          <RadioButtonSelected />
        ) : (
          <RadioButtonNotSelected />
        )}
        <Web3Address
          isTruncated
          copyByAddressClick={false}
          blockchain={String(chainId)}
          entityTag={"SigningAccount"}
          address={signingAccount.address}
          fontSize={"12px"}
          gap={"5px"}
        />
      </Flex>
      <Text fontSize={"12px"} w={"118px"}>
        {signingAccount.subdomain}
      </Text>
      <div className={styles.statusLive}>Live</div>

      <Flex alignItems={"center"} gap={"10px"} w={"241px"}>
        <Flex alignItems={"center"} w={"217px"} justifyContent={"space-between"}>
          {updatedBalance > 0 && (
            <Flex gap={"4px"} alignItems={"center"}>
              <CheckOnShieldIcon />
              <div className={styles.authOK}>Yes</div>
            </Flex>
          )}
          {updatedBalance === 0 &&
            terminusInfo.data &&
            terminusInfo.data.poolController === account && (
              <Flex gap={"4px"} alignItems={"center"}>
                <ErrorOnShieldIcon />
                <div className={styles.authError}>No authorization badge</div>
              </Flex>
            )}
          {updatedBalance === 0 &&
            terminusInfo.data &&
            terminusInfo.data.poolController !== account && (
              <Flex gap={"4px"} alignItems={"center"}>
                <ErrorOnShieldIcon />
                <div className={styles.authError}>
                  No authorization badge, contact pool controller →
                </div>
              </Flex>
            )}
          {terminusInfo.data && terminusInfo.data.poolController === account && (
            <Flex gap={"5px"}>
              {updatedBalance === 0 ? (
                <button
                  className={styles.buttonMint}
                  onClick={() =>
                    mintTokens.mutate({
                      to: signingAccount.address,
                      poolID: Number(dropAuthorization.poolId),
                      amount: Number(1),
                    })
                  }
                  disabled={mintTokens.isLoading}
                >
                  {mintTokens.isLoading ? <Spinner mx="auto" h={"12px"} w={"12px"} /> : "Mint"}
                </button>
              ) : (
                <button
                  className={styles.buttonBurn}
                  onClick={() =>
                    burnTokens.mutate({
                      from: signingAccount.address,
                      poolID: Number(dropAuthorization.poolId),
                      amount: Number(updatedBalance),
                    })
                  }
                  disabled={burnTokens.isLoading}
                >
                  {burnTokens.isLoading ? <Spinner mx="auto" h={"12px"} w={"12px"} /> : "Burn"}
                </button>
              )}
            </Flex>
          )}
        </Flex>
        {terminusInfo.data && (
          <AuthorizationInfo
            hasAuthority={terminusInfo.data.poolController === account}
            isToken={updatedBalance > 0}
            address={signingAccount.address}
            dropAuthorization={dropAuthorization}
            controllers={terminusInfo.data}
            mintingMutation={mintTokens}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default SigningAccountView;
