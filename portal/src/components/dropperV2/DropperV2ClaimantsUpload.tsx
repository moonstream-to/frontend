/* eslint-disable react/no-children-prop */
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Box, Flex, Link, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import Papa from "papaparse";

import http from "../../utils/httpMoonstream";
import Web3Context from "../../contexts/Web3Context/context";
import JSONUpload from "./JSONUpload";
import SigningAccountView from "./SigningAccountView";
import useMoonToast from "../../hooks/useMoonToast";

import { AbiItem, hexToNumber } from "web3-utils";
import importedTerminusAbi from "../../web3/abi/MockTerminus.json";
const terminusAbi = importedTerminusAbi as unknown as AbiItem[];
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import importedMulticallABI from "../../web3/abi/Multicall2.json";
const multicallABI = importedMulticallABI as unknown as AbiItem[];
import { DISCORD_LINK, MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";
import UploadErrorView from "./UploadErrorView";
import styles from "./DropperV2ClaimantsUpload.module.css";
import {
  checkDropperRequests,
  ClaimRequest,
  MetaTxClaimRequest,
  WaggleClaimRequest,
} from "../../utils/CheckDropperRequests";
import RadioButtonSelected from "../icons/RadioButtonSelected";
import RadioButtonNotSelected from "../icons/RadioButtonNotSelected";
import UnavailableWaggleServer from "./UnavailableWaggleServer";

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
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSignerAccount, setSelectedSignerAccount] = useState<
    | {
        subdomain: string;
        address: string;
      }
    | undefined
  >(undefined);

  const [manualSigningSelected, setManualSigningSelected] = useState(false);

  const signingServer = useQuery(["signing_server", dropAuthorization], async () => {
    const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
    const authorization = token ? { Authorization: `Bearer ${token}` } : {};
    const moonstreamApplicationId = process.env.NEXT_PUBLIC_MOONSTREAM_APPLICATION_ID;
    // return { signingAccounts: [], unavailableServers: [] };

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
        return results
          .filter(
            (res): res is PromiseFulfilledResult<{ subdomain: string; address: string }[]> =>
              res.status === "fulfilled",
          )
          .flatMap((result) => result.value);
      })
      .catch((error) => {
        console.error("Promise.allSettled catch", error);
      });
    const unavailableServers = subdomains.filter(
      (subdomain: string) =>
        !signers ||
        !signers.some((signer: { subdomain: string }) => signer.subdomain === subdomain),
    );
    if (!signers) {
      return { signingAccounts: [], unavailableServers };
    }
    if (!selectedSignerAccount && !manualSigningSelected) {
      setSelectedSignerAccount(signers[0]);
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
    const multicallResults = await multicallContract.methods
      .tryAggregate(false, multicallRequests)
      .call();

    const signingAccounts = signers.map((signer, idx) => {
      return {
        ...signer,
        balance: multicallResults[idx][0] ? hexToNumber(multicallResults[idx][1]) : 0,
      };
    });
    return { signingAccounts, unavailableServers };
  });

  const createSignerRequests = ({
    requests,
    serverName,
    signingAccount,
    ttl,
  }: {
    requests: any[];
    serverName: string;
    signingAccount: string;
    ttl: number;
  }) => {
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

  const createRequests = ({ specifications, ttl }: { specifications: any[]; ttl: number }) => {
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

  const displayErrorMessage = (message: string) => {
    setErrorMessage(message);
    onOpen();
  };

  const onDrop = (file: any) => {
    if (!file.length) {
      return;
    }
    const fileReader = new FileReader();
    setIsUploading(true);

    fileReader.readAsText(file[0]);
    fileReader.onloadend = async (readerEvent: ProgressEvent<FileReader>) => {
      if (readerEvent?.target?.result) {
        try {
          const fileName = file[0].name;
          const content = readerEvent.target.result as string;

          if (fileName.endsWith(".json")) {
            const jsonData = JSON.parse(content);
            await processContent(jsonData);
          } else if (fileName.endsWith(".csv")) {
            Papa.parse(content, {
              header: true,
              complete: async (results) => {
                await processContent(results.data as ClaimRequest[]);
              },
              error: (error: Error) => {
                throw error;
              },
            });
          } else {
            throw new Error("Unsupported file type");
          }
        } catch (e: any) {
          console.log(e);
          displayErrorMessage(`Upload failed - ${e.message ?? "Error processing the file"}`);
        } finally {
          setIsUploading(false);
        }
      } else {
        setIsUploading(false);
      }
    };

    fileReader.onerror = () => {
      console.log("Error reading the file");
      setIsUploading(false);
    };
  };

  const processContent = async (content: ClaimRequest[]) => {
    if (selectedSignerAccount) {
      await processSigningServerRequest(content as WaggleClaimRequest[]);
    } else {
      await processMetaTxRequest(content as MetaTxClaimRequest[]);
    }
  };

  const getTTL = () => {
    const input = prompt("TTL (days):", "30");
    if (!input) {
      return;
    }
    const ttl = Number(input);
    if (isNaN(ttl)) {
      displayErrorMessage("TTL should be a number");
      return;
    }
    if (ttl === 0) {
      displayErrorMessage("TTL should be positive number");
      return;
    }
    return ttl;
  };

  const processSigningServerRequest = async (content: WaggleClaimRequest[]) => {
    if (!selectedSignerAccount) {
      return;
    }
    const requests = content.map((item) => {
      const { requestID, dropId, claimant, blockDeadline, amount } = item;
      return {
        dropId,
        requestID,
        claimant,
        blockDeadline,
        amount,
      };
    });
    const errorMsg = checkDropperRequests({ content: requests, isSigned: false });
    if (errorMsg) {
      displayErrorMessage(errorMsg);
      return;
    }
    const ttl = getTTL();
    if (!ttl) {
      return;
    }
    try {
      const response = await createSignerRequests({
        requests,
        serverName: selectedSignerAccount.subdomain,
        signingAccount: selectedSignerAccount.address,
        ttl,
      });
      if (!response.data.metatx_registered) {
        console.log(response.data);
        displayErrorMessage(
          `${response.data.requests.length} requests signed, but registering in metatx failed`,
        );
      } else {
        toast(`${response.data.requests.length} requests signed`, "success");
      }
    } catch (e: unknown) {
      console.log(e);
      if (e instanceof AxiosError) {
        displayErrorMessage(`${e.response?.data ?? ""}\n${e.message ?? "Error creating request"}`);
      } else if (e instanceof Error) {
        displayErrorMessage(e.message);
      } else {
        displayErrorMessage("An unexpected error occurred");
      }
    }
  };

  const processMetaTxRequest = async (content: MetaTxClaimRequest[]) => {
    //MetaTx request
    const specifications = content.map((item: any) => {
      const { dropId, requestID, caller, blockDeadline, amount, signature, signer } = item;
      return {
        method: "claim",
        caller,
        request_id: requestID,
        parameters: { dropId, blockDeadline, amount, signature, signer },
      };
    });
    // const errorMsg = checkDropperRequests({ content, isSigned: true });
    // if (errorMsg) {
    //   displayErrorMessage(errorMsg);
    //   return;
    // }
    const ttl = getTTL();
    if (!ttl) {
      return;
    }
    try {
      const response = await createRequests({ specifications, ttl });
      toast(`Successfully added ${response.data} requests`, "success");
    } catch (e: any) {
      console.log(e);
      if (Array.isArray(e.response.data.detail)) {
        const errors = Array.from(
          new Set(
            e.response.data.detail.map(
              (error: any) => `${error.loc[error.loc.length - 1]} - ${error.msg}`,
            ),
          ),
        ).join("\n");
        displayErrorMessage(`${errors ?? "Error creating request"}`);
      } else {
        displayErrorMessage(`${e.response.data.detail ?? "Error creating request"}`);
      }
    }
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
        {signingServer.isLoading && <Spinner h={"12px"} w={"12px"} />}
        {signingServer.data && (
          <Flex direction={"column"} gap={"20px"}>
            <Text fontSize={"14px"} fontWeight={"700"}>
              Select claim signing method
            </Text>
            <Flex direction={"column"} gap={"10px"}>
              <Text fontSize={"12px"} fontWeight={"700"}>
                Signing via Waggle server
              </Text>
              {signingServer.data.signingAccounts.length +
                signingServer.data.unavailableServers.length >
              0 ? (
                <Text color={"#BFBFBF"} fontSize={"12px"} maxW={"360px"}>
                  Uploaded drop claims will be signed off by the Waggle server. Select an account
                  you have access to below
                </Text>
              ) : (
                <Flex
                  padding={"10px"}
                  borderRadius={"5px"}
                  bg={"#101114"}
                  gap={"10px"}
                  direction={"column"}
                >
                  <Text fontSize={"12px"} fontWeight={"400"} color={"#BFBFBF"}>
                    Contact us to set up a Waggle server and enable drop claims sign off
                    functionality
                  </Text>
                  <button
                    className={styles.contactUsButton}
                    onClick={() => window.open(DISCORD_LINK, "_blank")}
                  >
                    Contact us
                  </button>
                </Flex>
              )}
            </Flex>
            {signingServer.data.signingAccounts.length +
              signingServer.data.unavailableServers.length >
              0 && (
              <>
                <Flex
                  fontSize={"12px"}
                  color={"#848484"}
                  lineHeight={"100%"}
                  justifyContent={"space-between"}
                  mt={"20px"}
                >
                  <Text w={"156px"}>Account address</Text>
                  <Text w={"118px"}>Server</Text>
                  <Text w={"80px"}>Server status</Text>
                  <Text w={"241px"}>Pool signing authority</Text>
                </Flex>
                <Box w={"100%"} h={"0.5px"} bg={"#848484"} />

                {signingServer.data.signingAccounts.map(
                  (s, idx) =>
                    s.balance !== undefined &&
                    s.address !== undefined && (
                      <SigningAccountView
                        key={idx}
                        selectedSignerAccount={selectedSignerAccount}
                        setSelectedSignerAccount={setSelectedSignerAccount}
                        signingAccount={s}
                        dropAuthorization={dropAuthorization}
                      />
                    ),
                )}
                {signingServer.data.unavailableServers.map((s: string, idx: number) => (
                  <UnavailableWaggleServer subdomain={s} key={idx} />
                ))}
              </>
            )}

            <Box w={"100%"} h={"0.5px"} bg={"#848484"} />
            <Flex
              alignItems={"center"}
              gap={"10px"}
              onClick={() => {
                setSelectedSignerAccount(undefined);
                setManualSigningSelected(true);
              }}
              cursor={"pointer"}
              w={"fit-content"}
            >
              {selectedSignerAccount === undefined ? (
                <RadioButtonSelected />
              ) : (
                <RadioButtonNotSelected />
              )}
              <Text fontSize={"14px"}>
                Manual signing –{" "}
                <span style={{ color: "#BFBFBF" }}>Requests should already be signed</span>
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
      <JSONUpload
        minW="100%"
        isUploading={isUploading}
        onDrop={onDrop}
        isSigned={!selectedSignerAccount}
      />
      <UploadErrorView message={errorMessage} isOpen={isOpen} onClose={onClose} />
      {!selectedSignerAccount && (
        <Flex gap={"5px"} alignItems={"end"} mx={"auto"}>
          <Text>Use</Text>
          <Link
            mt="5px"
            textDecoration="none"
            placeSelf="start"
            href="https://github.com/moonstream-to/waggle"
            isExternal
            color={"#f88f78"}
          >
            Waggle CLI tool
          </Link>
          <Text>to prepare the file</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default DropperV2ClaimantsUpload;
