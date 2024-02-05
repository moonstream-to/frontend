/* eslint-disable react/no-children-prop */
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Box, Flex, Link, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";

import http from "../../utils/httpMoonstream";
import Web3Context from "../../contexts/Web3Context/context";
import JSONUpload from "./JSONUpload";
import SigningAccountView from "../dropper/SigningAccountView";
import useMoonToast from "../../hooks/useMoonToast";

import { AbiItem, hexToNumber } from "web3-utils";
import importedTerminusAbi from "../../web3/abi/MockTerminus.json";
const terminusAbi = importedTerminusAbi as unknown as AbiItem[];
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import importedMulticallABI from "../../web3/abi/Multicall2.json";
const multicallABI = importedMulticallABI as unknown as AbiItem[];
import { MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";

const DropperV2ClaimantsUpload = ({
  contractAddress,
  dropAuthorization,
}: {
  contractAddress: string;
  dropAuthorization: { poolId: string; terminusAddress: string };
}) => {
  const toast = useMoonToast();

  const [isUploading, setIsUploading] = useState(false);
  const { web3, chainId } = useContext(Web3Context);
  const [selectedSignerAccount, setSelectedSignerAccount] = useState<
    | {
        subdomain: string;
        address: string;
      }
    | undefined
  >(undefined);

  const signingServer = useQuery(["signing_server", dropAuthorization], async () => {
    const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
    const authorization = token ? { Authorization: `Bearer ${token}` } : {};
    const moonstreamApplicationId = process.env.NEXT_PUBLIC_MOONSTREAM_APPLICATION_ID;
    const subdomains = await axios
      .get(
        `https://auth.bugout.dev/resources?application_id=${moonstreamApplicationId}&type=waggle-access`,
        {
          headers: {
            "Content-Type": "application/json",
            ...authorization,
          },
        },
      )
      .then((res) => {
        return res.data.resources
          .filter((r: any) => r.resource_data.type === "waggle-access")
          .map((r: any) => r.resource_data.customer_name);
      });

    // const mockSubdomains = subdomains.concat([...subdomains]).concat("lorefy");

    const requests = subdomains.map((subdomain: string) => {
      return axios
        .get(`https://${subdomain}.waggle.moonstream.org/signers/`, {
          headers: {
            "Content-Type": "application/json",
            ...authorization,
          },
        })
        .then((res) => {
          return res.data.signers.map((s: string) => {
            return { subdomain: subdomain, address: s };
          });
        });
    });

    const signers = await Promise.allSettled(requests)
      .then((results) => {
        console.log("Promise.allSettled then", results);
        return results
          .filter(
            (r): r is PromiseFulfilledResult<{ subdomain: string; address: string }[]> =>
              r.status === "fulfilled",
          )
          .flatMap((result) => result.value);
      })
      .catch((error) => {
        console.error("Promise.allSettled catch", error);
      });
    console.log(signers);
    if (!signers) {
      return [];
    }
    const MULTICALL2_CONTRACT_ADDRESS =
      MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES];
    const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS);
    const terminusContract = new web3.eth.Contract(
      terminusAbi,
      dropAuthorization.terminusAddress,
    ) as any as MockTerminus;
    const multicallRequests = signers.map((signer) => {
      return {
        target: dropAuthorization.terminusAddress,
        callData: terminusContract.methods
          .balanceOf(signer.address, dropAuthorization.poolId)
          .encodeABI(),
      };
    });
    console.log(multicallRequests);
    const multicallResults = await multicallContract.methods
      .tryAggregate(false, multicallRequests)
      .call();
    return signers.map((signer, idx) => {
      return {
        ...signer,
        balance: multicallResults[idx][0] ? hexToNumber(multicallResults[idx][1]) : 0,
      };
    });
  });

  const createSignerRequests = ({
    requests,
    serverName,
    signingAccount,
  }: {
    requests: any[];
    serverName: string;
    signingAccount: string;
  }) => {
    const ttl = prompt("TTL (days):");
    // const serverName = "fullcount";
    // const serverSigningAccount = "0x790CCaB1c3d308ceA7689C9A720f220c6C44eAD7";

    const url = `https://${serverName}.waggle.moonstream.org/signers/${signingAccount}/dropper/sign`;
    return http({
      method: "POST",
      url,
      data: {
        chain_id: chainId,
        dropper: contractAddress,
        ttl_days: Number(ttl),
        sensible: false,
        requests,
      },
    });
  };

  const createRequests = ({ specifications }: { specifications: any[] }) => {
    const ttl = prompt("TTL (days):");
    return http({
      method: "POST",
      url: "https://engineapi.moonstream.to/metatx/requests",
      data: {
        contract_address: contractAddress,
        ttl_days: ttl,
        specifications,
      },
    });
  };

  const onDrop = (file: any) => {
    if (!file.length) {
      return;
    }
    const fileReader = new FileReader();
    setIsUploading(true);
    try {
      fileReader.readAsText(file[0]);
      fileReader.onloadend = async (readerEvent: ProgressEvent<FileReader>) => {
        if (readerEvent?.target?.result) {
          try {
            const content = JSON.parse(String(readerEvent?.target?.result));
            let response;
            if (selectedSignerAccount) {
              //SigningServer request
              const requests = content.map((item: any) => {
                const { requestID, dropId, claimant, blockDeadline, amount } = item;
                return {
                  dropId,
                  requestID,
                  claimant,
                  blockDeadline,
                  amount,
                };
              });
              response = await createSignerRequests({
                requests,
                serverName: selectedSignerAccount.subdomain,
                signingAccount: selectedSignerAccount.address,
              });
              toast(`${response.data.requests.length} requests signed`, "success");
              console.log(response);
            } else {
              //MetaTx request
              const specifications = content.map((item: any) => {
                const { dropId, requestID, caller, blockDeadline, amount, signature, signer } =
                  item;
                return {
                  method: "claim",
                  caller,
                  request_id: requestID,
                  parameters: { dropId, blockDeadline, amount, signature, signer },
                };
              });
              response = await createRequests({ specifications });
              if (response.status === 200) {
                toast(`Successfully added ${response.data} requests`, "success");
              }
            }

            if (response.status === 200) {
              console.log(response);
              // toast(`Successfully added ${response.data} requests`, "success");
            }
          } catch (e: any) {
            toast(`Upload failed - ${e.message ?? "Error creating request"}`, "error");
          }
          setIsUploading(false);
        }
      };
    } catch (e) {
      console.log(e);
    }
    setIsUploading(false);
  };

  return (
    <Flex position="relative" direction={"column"}>
      <Flex
        borderRadius="10px"
        mb={"20px"}
        p="15px"
        border={"1px solid #4D4D4D"}
        bg="#232323"
        justifyContent={"space-between"}
        gap={"20px"}
        direction={"column"}
      >
        {" "}
        {signingServer.isLoading && (
          <Text fontSize={"14px"} fontWeight={"700"}>
            checking for signing accounts
          </Text>
        )}
        {signingServer.data && signingServer.data.length === 0 && (
          <Text fontSize={"14px"} fontWeight={"700"}>
            no signing account
          </Text>
        )}
        {signingServer.isLoading && <Spinner h={"12px"} w={"12px"} />}
        {signingServer.data && signingServer.data.length > 0 && (
          <Flex direction={"column"} gap={"10px"}>
            <Text fontSize={"14px"} fontWeight={"700"}>
              Select an account from a waggle server that you have access to
            </Text>
            <Flex
              alignItems={"center"}
              gap={"10px"}
              onClick={() => setSelectedSignerAccount(undefined)}
              cursor={"pointer"}
            >
              <Flex
                w={"16px"}
                h={"16px"}
                borderRadius={"50%"}
                border={"2px solid white"}
                bg={"transparent"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Box
                  w={"8px"}
                  h={"8px"}
                  borderRadius={"50%"}
                  bg={selectedSignerAccount === undefined ? "#F56646" : "transparent"}
                />
              </Flex>
              <Text fontSize={"14px"}>no, requests are signed already</Text>
            </Flex>
            {signingServer.data.map((s, idx) => (
              <SigningAccountView
                key={idx}
                selectedSignerAccount={selectedSignerAccount}
                setSelectedSignerAccount={setSelectedSignerAccount}
                signingAccount={{
                  ...s,
                  tokensNumber: s.balance,
                }}
                dropAuthorization={dropAuthorization}
              />
            ))}
          </Flex>
        )}
      </Flex>
      <JSONUpload
        minW="100%"
        isUploading={isUploading}
        onDrop={onDrop}
        isSigned={!selectedSignerAccount}
      />
      {!selectedSignerAccount && (
        <Link
          mt="5px"
          mx={"auto"}
          textDecoration="underline"
          placeSelf="start"
          href="https://github.com/moonstream-to/waggle"
          isExternal
          color={"#DDD"}
        >
          Tool you can create this file with
        </Link>
      )}
    </Flex>
  );
};

export default DropperV2ClaimantsUpload;
