import React, { useState } from "react";
import styles from "./BridgeView.module.css";
import { useMutation, useQuery } from "react-query";
import Web3 from "web3";
import { ethers, providers } from "ethers";
import { L2ToL1MessageStatus, L2ToL1MessageWriter, L2TransactionReceipt } from "@arbitrum/sdk";
import { Spinner } from "@chakra-ui/react";
import Web3Address from "../entity/Web3Address";
import useMoonToast from "../../hooks/useMoonToast";

const L3_RPC = "https://game7-testnet-custom.rpc.caldera.xyz/http";
const web3 = new Web3(L3_RPC);
const l3Provider = new providers.JsonRpcProvider(L3_RPC);

function convertTimestampToLocalFormat(timestamp: string | number): string {
  const date = new Date(Number(timestamp) * 1000);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formattedDate = date.toLocaleString(undefined, options);
  const timeZoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(timeZoneOffset / 60);
  const offsetMinutes = timeZoneOffset % 60;
  const formattedOffset = `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}:${offsetMinutes
    .toString()
    .padStart(2, "0")}`;
  return `${formattedDate} (${formattedOffset})`;
}

const eventABI = {
  anonymous: false,
  inputs: [
    { indexed: false, internalType: "address", name: "caller", type: "address" },
    { indexed: true, internalType: "address", name: "destination", type: "address" },
    { indexed: true, internalType: "uint256", name: "hash", type: "uint256" },
    { indexed: true, internalType: "uint256", name: "position", type: "uint256" },
    { indexed: false, internalType: "uint256", name: "arbBlockNum", type: "uint256" },
    { indexed: false, internalType: "uint256", name: "ethBlockNum", type: "uint256" },
    { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    { indexed: false, internalType: "uint256", name: "callvalue", type: "uint256" },
    { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
  ],
  name: "L2ToL1Tx",
  type: "event",
};

interface WithdrawalProps {
  txHash: string;
}
const Withdrawal: React.FC<WithdrawalProps> = ({ txHash }) => {
  const [message, setMessage] = useState<L2ToL1MessageWriter | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isForcedRefetching, setIsForcedRefetching] = useState(false);

  const status = useQuery(
    ["withdrawalStatus", txHash],
    async () => {
      console.log("checking status", txHash.slice(0, 6));
      const receipt = await l3Provider.getTransactionReceipt(txHash);
      const l2Receipt = new L2TransactionReceipt(receipt);
      const log = receipt.logs.find((l) => l.data !== "0x");
      let decodedLog;
      let ethProvider;
      if (log) {
        try {
          decodedLog = web3.eth.abi.decodeLog(eventABI.inputs, log.data, log.topics.slice(1));
        } catch (e) {
          console.log(log, e);
        }
      }
      if (typeof window.ethereum !== "undefined") {
        ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        console.log("Please install MetaMask!");
      }
      if (!ethProvider) {
        console.log("!ethProvider");
        return;
      }
      const signer = ethProvider?.getSigner();
      const messages: L2ToL1MessageWriter[] = (await l2Receipt.getL2ToL1Messages(
        signer,
      )) as L2ToL1MessageWriter[];
      const l2ToL1Msg: L2ToL1MessageWriter = messages[0];
      setMessage(l2ToL1Msg);
      const status: L2ToL1MessageStatus = await l2ToL1Msg.status(l3Provider);
      setIsForcedRefetching(false);
      return {
        from: decodedLog?.caller,
        to: decodedLog?.destination,
        value: web3.utils.fromWei(decodedLog?.callvalue ?? "", "ether"),
        timestamp: decodedLog?.timestamp,
        confirmations: receipt.confirmations,
        status,
      };
    },
    {
      refetchInterval: 60000 * 3,
    },
  );

  const execute = useMutation(
    async (message: L2ToL1MessageWriter) => {
      console.log(message);
      const res = await message.execute(l3Provider);
      const rec = await res.wait();
      console.log("Done! Your transaction is executed", rec);
      return rec;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        setIsSuccess(true);
        status.refetch();
      },
    },
  );

  const toast = useMoonToast();
  const handleExecute = () => {
    if (!message) {
      toast("Unexpected error: no message to execute", "error");
      return;
    }
    execute.mutate(message);
  };

  return (
    <div className={styles.withdrawalContainer}>
      {`${txHash.slice(0, 10)}...`}
      <div className={styles.details}>
        {status.data?.timestamp && (
          <div className={styles.timestamp}>
            {convertTimestampToLocalFormat(status.data.timestamp)}
          </div>
        )}
        {status.data?.from && <Web3Address entityTag={"account"} address={status.data.from} />}
        {status.data?.to && <Web3Address address={status.data.to} />}
        {status.data?.value && <div className={styles.value}>{status.data.value}</div>}
        {status.data?.confirmations && (
          <div className={styles.value}>{`${status.data.confirmations} confirmations`}</div>
        )}
      </div>

      {status.isLoading || (status.isRefetching && isForcedRefetching) ? (
        <Spinner w={2} h={2} />
      ) : (
        <>
          {!!status.data && (status.data.status === L2ToL1MessageStatus.EXECUTED || isSuccess) && (
            <div className={styles.executed}>executed</div>
          )}
          {!!status.data && status.data.status === L2ToL1MessageStatus.CONFIRMED && !isSuccess && (
            <button className={styles.button} onClick={handleExecute}>
              {execute.isLoading ? <Spinner /> : "execute"}
            </button>
          )}
          {(!!status.data || (status.data as unknown as number) === 0) &&
            (status.data?.status as number) === 0 && <div>unconfirmed</div>}
        </>
      )}
      <button
        onClick={() => {
          setIsForcedRefetching(true);
          status.refetch();
        }}
      >
        refresh
      </button>
    </div>
  );
};

export default Withdrawal;
