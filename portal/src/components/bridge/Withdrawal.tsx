import React, { useState } from "react";
import styles from "./BridgeView.module.css";
import { useMutation, useQuery } from "react-query";
import Web3 from "web3";
import { providers, Wallet } from "ethers";
import { L2ToL1MessageStatus, L2ToL1MessageWriter, L2TransactionReceipt } from "@arbitrum/sdk";
import { Spinner } from "@chakra-ui/react";

const L3_RPC = "https://game7-testnet-custom.rpc.caldera.xyz/http";
const L2_RPC = "https://sepolia-rollup.arbitrum.io/rpc";
// Replace with your L3 node URL
const web3 = new Web3(L3_RPC);
const l3Provider = new providers.JsonRpcProvider(L3_RPC);
const l2Provider = new providers.JsonRpcProvider(L2_RPC);
const userAddress = "0x605825459E3e98565827Af31DF4cA854A7cCED28";

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? "";
console.log({ privateKey });
const l2wallet = new Wallet(privateKey, l2Provider);

interface WithdrawalProps {
  txHash: string;
}
const Withdrawal: React.FC<WithdrawalProps> = ({ txHash }) => {
  const [message, setMessage] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const status = useQuery(
    ["withdrawalStatus", txHash],
    async () => {
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      const l2Receipt = new L2TransactionReceipt(receipt);
      const messages: L2ToL1MessageWriter[] = await l2Receipt.getL2ToL1Messages(l2wallet);
      const l2ToL1Msg: L2ToL1MessageWriter = messages[0];
      setMessage(l2ToL1Msg);
      const status: L2ToL1MessageStatus = await l2ToL1Msg.status(l3Provider);
      // console.log(status === 0);
      return status;
    },
    {
      refetchInterval: 50000,
    },
  );

  const execute = useMutation(
    async () => {
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

  return (
    <div className={styles.withdrawalContainer}>
      {`${txHash.slice(0, 10)}...`}
      {status.isLoading && <Spinner w={2} h={2} />}
      {!!status.data && (status.data === L2ToL1MessageStatus.EXECUTED || isSuccess) && (
        <div className={styles.executed}>executed</div>
      )}
      {!!status.data && status.data === L2ToL1MessageStatus.CONFIRMED && !isSuccess && (
        <button className={styles.button} onClick={() => execute.mutate()}>
          {execute.isLoading ? <Spinner /> : "execute"}
        </button>
      )}
      {!!status.data && status.data === L2ToL1MessageStatus.UNCONFIRMED && <div>ok</div>}
      {/*{!!status.data && status.data ==}*/}
      {/*{!!status.data && (status.data !== L2ToL1MessageStatus.EXECUTED) &&  (status.data !== L2ToL1MessageStatus.CONFIRMED) && <div className={styles.executed}>unconfirmed</div>}*/}
    </div>
  );
};

export default Withdrawal;
