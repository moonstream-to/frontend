import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";
import Web3Context from "../../contexts/Web3Context/context";

import { AbiItem } from "web3-utils";
import importedMulticallABI from "../../web3/abi/Multicall2.json";
const multicallABI = importedMulticallABI as unknown as AbiItem[];
import importedDropperAbi from "../../web3/abi/DropperV2.json";
const dropperAbi = importedDropperAbi as unknown as AbiItem[];

import { MULTICALL2_CONTRACT_ADDRESSES } from "../../constants";
import { Flex } from "@chakra-ui/react";
import ClaimCard from "./ClaimCard";

export type Request = {
  request_id: string;
  id: string;
  created_at: string;
  expires_at: string;
  parameters: {
    amount: number;
    dropId: string;
    blockDeadline: string;
    signer: string;
    signature: string;
  };
};

type Requests = ReadonlyArray<Request>;

type responseWithDetails = {
  response: { data: { detail: string } };
  message: string;
};

const ClaimView = () => {
  const router = useRouter();
  const { account, chainId, web3 } = useContext(Web3Context);
  const [callerAccount, setCallerAccount] = useState("");
  const [dropId, setDropId] = useState("");
  const [dropperAddress, setDropperAddress] = useState("");
  const currentBlock = useQuery(["currentBlock"], () => {
    return web3.eth.getBlockNumber();
  });

  useEffect(() => {
    setCallerAccount(account);
  }, [account]);

  useEffect(() => {
    if (router.query.dropId) {
      setDropId(Array.isArray(router.query.dropId) ? router.query.dropId[0] : router.query.dropId);
    }
    if (router.query.dropperAddress) {
      setDropperAddress(
        Array.isArray(router.query.dropperAddress)
          ? router.query.dropperAddress[0]
          : router.query.dropperAddress,
      );
    }
  }, [router.query.dropId, router.query.dropperAddress]);

  const fetchRequests = async ({ queryKey }: { queryKey: any }): Promise<Requests | undefined> => {
    const [, contractAddress, caller] = queryKey;
    if (!web3.utils.isAddress(callerAccount)) {
      return;
    }

    return axios({
      method: "GET",
      url: `https://engineapi.moonstream.to/metatx/requests`,
      params: { contract_address: contractAddress, caller },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch((e: responseWithDetails) => {
        const result =
          e.response?.data?.detail === "Address not present in that drop."
            ? "Not found"
            : e.message;
        console.log(result);
      });
  };

  const requests = useQuery(["requests", dropperAddress, callerAccount], fetchRequests);

  function isValidBigNumber(value: string) {
    try {
      web3.utils.toBN(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  const claimStatuses = useQuery(["claimStatuses", requests.data, dropperAddress], async () => {
    if (!requests.data) {
      return;
    }
    console.log("statuses");
    const MULTICALL2_CONTRACT_ADDRESS =
      MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES];
    const dropperContract = new web3.eth.Contract(dropperAbi);
    dropperContract.options.address = dropperAddress ?? "";
    const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS);
    const queries = requests.data?.map((r) => {
      return {
        callData: dropperContract.methods
          .claimStatus(
            !!r.parameters.dropId ? r.parameters.dropId : "0",
            isValidBigNumber(r.request_id) ? r.request_id : "0",
          )
          .encodeABI(),
        target: dropperAddress,
      };
    });
    const statuses = await multicallContract.methods.tryAggregate(false, queries).call();
    console.log("called");
    const res = requests.data.map((r, idx) => {
      return {
        requestId: r.request_id,
        isClaimed: statuses[idx][0] ? !!web3.utils.hexToNumber(statuses[idx][1]) : undefined,
      };
    });
    console.log(res);
    return res;
  });

  return (
    <Flex direction={"column"} p={"30px"} gap={"20px"}>
      <Flex gap={"20px"}>
        <input
          style={{ width: "45ch", color: "black", paddingLeft: "5px" }}
          type="text"
          onChange={(e) => setCallerAccount(e.target.value)}
          value={callerAccount}
        />
        <button onClick={() => setCallerAccount(account)}>from wallet</button>
      </Flex>
      <Flex wrap={"wrap"} w={"fit-content"} gap={"10px"}>
        {requests.data &&
          requests.data.map((r, idx) => (
            <ClaimCard
              key={idx}
              dropperAddress={dropperAddress}
              request={r}
              isClaimed={
                claimStatuses.data?.some((s) => s.requestId === r.request_id && s.isClaimed) ?? true
              }
              currentBlock={currentBlock.data}
            />
          ))}
      </Flex>
    </Flex>
  );
};

export default ClaimView;
