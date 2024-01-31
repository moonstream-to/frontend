/* eslint-disable react/no-children-prop */
import { useContext, useState } from "react";

import { Flex, Text } from "@chakra-ui/react";

import useMoonToast from "../../hooks/useMoonToast";
import JSONUpload from "./JSONUpload";
import http from "../../utils/httpMoonstream";
import { useQuery } from "react-query";
import axios from "axios";
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import Web3Context from "../../contexts/Web3Context/context";
import styles from "./DropperV2.module.css";

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
        return res.data.signers;
      });
    let terminusBalance;
    if (signers && signers.length > 0) {
      const terminusContract = new web3.eth.Contract(
        terminusAbi,
        dropAuthorization.terminusAddress,
      ) as unknown as MockTerminus;
      terminusBalance = await terminusContract.methods
        .balanceOf(signers[0], dropAuthorization.poolId)
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
            if (signingServer.data?.signers[0]) {
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
              console.log(requests);
              response = await createSignerRequests({
                requests,
                signingAccount: signingServer.data.signers[0],
              });
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
      <JSONUpload minW="100%" isUploading={isUploading} onDrop={onDrop} />
      {signingServer.data && signingServer.data.signers.length > 0 && (
        <Flex borderRadius="10px" mt="5px" bg="#232323" justifyContent={"space-between"}>
          <Flex direction={"column"} justifyContent={"space-between"}>
            <Text>Signer</Text>
            <Text>{signingServer.data.signers[0]}</Text>
          </Flex>
          <Flex direction={"column"} alignItems={"end"}>
            <Text>Autorization tokens</Text>
            <Text>{signingServer.data.terminusBalance}</Text>
          </Flex>
          <div className={styles.actionText}>actions</div>
        </Flex>
      )}
    </Flex>
  );
};

export default DropperV2ClaimantsUpload;
