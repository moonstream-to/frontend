/* eslint-disable react/no-children-prop */
import React, { useContext, useState } from "react";

import { Box, Flex, Link, Spinner, Text } from "@chakra-ui/react";

import useMoonToast from "../../hooks/useMoonToast";
import JSONUpload from "./JSONUpload";
import http from "../../utils/httpMoonstream";
import { useQuery } from "react-query";
import axios from "axios";
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import Web3Context from "../../contexts/Web3Context/context";
import styles from "./DropperV2.module.css";
import SigningAccountView from "../dropper/SigningAccountView";

// const dropId = "15";
// const chain_id = 80001;
const terminusAbi = require("../../web3/abi/MockTerminus.json");

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
  const [selectedSignerAccount, setSelectedSignerAccount] = useState("");

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
        // console.log(res.data);
        return res.data.resources
          .filter((r: any) => r.resource_data.type === "waggle-access")
          .map((r: any) => r.resource_data.customer_name);
      });
    console.log(subdomains);

    const requests = subdomains.map((subdomain: string) => {
      return axios
        .get(`https://${subdomain}.waggle.moonstream.org/signers/`, {
          headers: {
            "Content-Type": "application/json",
            ...authorization,
          },
        })
        .then((res) => {
          return { subdomain: subdomain, signers: res.data.signers };
        });
    });

    Promise.all(requests)
      .then((results) => {
        console.log("accounts", results);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const signers = await axios
      .get(`https://${subdomains[0]}.waggle.moonstream.org/signers/`, {
        headers: {
          "Content-Type": "application/json",
          ...authorization,
        },
      })
      .then((res) => {
        console.log(res.data);
        return res.data.signers.map((s: string) => {
          return { address: s, subdomain: subdomains[0] };
        });
      });
    let terminusBalance;
    if (signers && signers.length > 0) {
      const terminusContract = new web3.eth.Contract(
        terminusAbi,
        dropAuthorization.terminusAddress,
      ) as unknown as MockTerminus;
      terminusBalance = await terminusContract.methods
        .balanceOf(signers[0].address, dropAuthorization.poolId)
        .call();
      return { signers, terminusBalance };
    }
  });

  const createSignerRequests = ({
    requests,
    signingAccount,
  }: {
    requests: any[];
    signingAccount: string;
  }) => {
    const ttl = prompt("TTL (days):");
    const serverName = "fullcount";
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
            if (selectedSignerAccount !== "") {
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
                signingAccount: selectedSignerAccount,
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
        <Text fontSize={"14px"} fontWeight={"700"}>
          Select an account from a waggle server that you have access to.
        </Text>
        {signingServer.isLoading && <Spinner />}
        {signingServer.data && signingServer.data.signers.length > 0 && (
          <Flex direction={"column"} gap={"10px"}>
            <Flex
              alignItems={"center"}
              gap={"10px"}
              onClick={() => setSelectedSignerAccount("")}
              cursor={"pointer"}
            >
              <Flex
                w={"12px"}
                h={"12px"}
                borderRadius={"50%"}
                border={"1px solid #4d4d4d"}
                bg={"transparent"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Box
                  w={"5px"}
                  h={"5px"}
                  borderRadius={"50%"}
                  bg={selectedSignerAccount === "" ? "white" : "transparent"}
                />
              </Flex>
              <Text fontSize={"14px"}>no, requests are signed already</Text>
            </Flex>
            <SigningAccountView
              selectedSignerAccount={selectedSignerAccount}
              setSelectedSignerAccount={setSelectedSignerAccount}
              signingAccount={{
                ...signingServer.data.signers[0],
                tokensNumber: signingServer.data.terminusBalance,
              }}
              dropAuthorization={dropAuthorization}
            />
          </Flex>
        )}
      </Flex>
      <JSONUpload
        minW="100%"
        isUploading={isUploading}
        onDrop={onDrop}
        isSigned={selectedSignerAccount === ""}
      />
      {selectedSignerAccount === "" && (
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
