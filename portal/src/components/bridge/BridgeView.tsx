import React, { useContext, useState } from "react";
import styles from "./BridgeView.module.css";
import { useMutation, useQuery } from "react-query";
const L2_CHAIN_NAME = "Arbitrum sepolia";
const L3_CHAIN_NAME = "Game7 Tesnet Caldera";
const ACCOUNT = "0x605825459E3e98565827Af31DF4cA854A7cCED28";
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? "";

const TX_HASH = "0x8c09f790e614a59e8a792c8e294569262ba4c82276124781678697b180dfc799";
const TX_HASH2 = "0x2bbfd507eb26a1f0c007345ce122d56000cbd98c45b7a62ca3f1aca629b9f899";
const TX_HASH3 = "0x9e8222d1ea8f7a55384802ef7aca582e08e582beb53cb03f1daacd1059ae267d";
const HASH4 = "0x4bf995f8db0500325df77bf912104b6b3b0604a44117dd6bfa47277e0d0ee875";
const HASH5 = "0xb778a3ec55896616ed033f05227c30ebc73c873f6f80fc999f63c7c3d4eeb6b4";

const txs = [
  "0x8c09f790e614a59e8a792c8e294569262ba4c82276124781678697b180dfc799",
  "0x2bbfd507eb26a1f0c007345ce122d56000cbd98c45b7a62ca3f1aca629b9f899",
  "0x9e8222d1ea8f7a55384802ef7aca582e08e582beb53cb03f1daacd1059ae267d",
  "0x4bf995f8db0500325df77bf912104b6b3b0604a44117dd6bfa47277e0d0ee875",
  "0xb778a3ec55896616ed033f05227c30ebc73c873f6f80fc999f63c7c3d4eeb6b4",
  "0x3fada554470e1600d27e70699990f7a77b3f8ee89b9e4b192419a58392d8fb8b",
  "0x20f1eb781b930193e6fce1069b64712fb42a3855ce09d78abe649ddd66aa907b",
  "0x02b6cf4313b5bbf2c1242bddbf03a0acefa1ea6200c53015b064db759eeba849",
  "0x732b7400fecea15dfc40912399311533ac53b1092b8835ec104c4f4efb933211",
];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require("web3");
const L3_RPC = "https://game7-testnet-custom.rpc.caldera.xyz/http";
const L2_RPC = "https://sepolia-rollup.arbitrum.io/rpc";

import { AbiItem } from "web3-utils";
import importedERC20ABI from "../../web3/abi/MockErc20.json";
const ERC20_ABI = importedERC20ABI as unknown as AbiItem[];
import importedERC20InboxABI from "../../web3/abi/ERC20Inbox.json";
const ERC20_INBOX_ABI = importedERC20InboxABI as unknown as AbiItem[];
import { providers } from "ethers";
import { Spinner } from "@chakra-ui/react";
import Web3Context from "../../contexts/Web3Context/context";
import { withdrawNativeToken } from "../abiView/bridgeNativeToken";
import Withdrawal from "./Withdrawal";
const ERC20_ADDRESS = "0x5f88d811246222F6CB54266C42cc1310510b9feA";
const ERC20_INBOX_ADDRESS = "0xaACd8bE2d9ac11545a2F0817aEE35058c70b44e5";

const BridgeView = () => {
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [withdrawals, setWithdrawals] = useState(txs);
  const l2Web3 = new Web3(L2_RPC);
  const l3Web3 = new Web3(L3_RPC);
  const web3ctx = useContext(Web3Context);

  function convertToBigNumber(numberString: string, precision = 18) {
    const [integerPart, decimalPart] = numberString.split(".");
    const decimalPartPadded = (decimalPart || "").padEnd(precision, "0");
    const bigNumberString = integerPart + decimalPartPadded;
    return l3Web3.utils.toBN(bigNumberString);
  }

  const l2Balance = useQuery(
    ["l2Balance"],
    async () => {
      const ERC20Contract = new l2Web3.eth.Contract(ERC20_ABI);
      ERC20Contract.options.address = ERC20_ADDRESS;
      const symbol = await ERC20Contract.methods.symbol().call();
      const weiBalance = await ERC20Contract.methods.balanceOf(ACCOUNT).call();
      const ethBalance = l2Web3.utils.fromWei(weiBalance, "ether");

      return `${ethBalance} ${symbol}`;
    },
    {
      refetchInterval: 5000,
    },
  );

  const l3Balance = useQuery(
    ["l3Balance"],
    async () => {
      const symbol = "G7T";
      const weiBalance = await l3Web3.eth.getBalance(ACCOUNT);
      const ethBalance = l3Web3.utils.fromWei(weiBalance, "ether");
      return `${ethBalance} ${symbol}`;
    },
    {
      refetchInterval: 5000,
    },
  );

  const deposit = useMutation(
    async (amount: string) => {
      const ERC20InboxContract = new web3ctx.web3.eth.Contract(ERC20_INBOX_ABI);
      ERC20InboxContract.options.address = ERC20_INBOX_ADDRESS;

      const ethAmount = convertToBigNumber(amount);
      const res = await ERC20InboxContract.methods.depositERC20(ethAmount).send({ from: ACCOUNT });
      console.log(res);
    },
    {
      onSuccess: () => {
        l2Balance.refetch();
        l3Balance.refetch();
      },
    },
  );

  const withdraw = useMutation(
    async (amount: string) => {
      return withdrawNativeToken(Number(amount));
    },
    {
      onSuccess: (data: any) => {
        console.log(data);
        setWithdrawals((prev) => [...prev, data]);
        l3Balance.refetch();
      },
    },
  );

  const handleDepositClick = () => {
    deposit.mutate(depositValue);
  };

  const handlewithdrawClick = () => {
    withdraw.mutate(withdrawValue);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chainContainer}>
        <div className={styles.chainName}>{L2_CHAIN_NAME}</div>
        <div className={styles.balance}>{l2Balance.data ?? ""}</div>
        <input
          className={styles.input}
          type={"text"}
          value={depositValue}
          onChange={(e) => setDepositValue(e.target.value)}
          placeholder={"amount"}
        />
        <button
          className={styles.button}
          onClick={handleDepositClick}
          style={{ placeSelf: "flex-end" }}
        >
          {deposit.isLoading ? <Spinner h={2} w={2} /> : ">>"}
        </button>
      </div>
      <div className={styles.chainContainer}>
        <div className={styles.chainName}>{L3_CHAIN_NAME}</div>
        <div className={styles.balance}>{l3Balance.data ?? ""}</div>
        <input
          type={"text"}
          value={withdrawValue}
          className={styles.input}
          onChange={(e) => setWithdrawValue(e.target.value)}
          placeholder={"amount"}
        />
        <button className={styles.button} onClick={handlewithdrawClick}>
          {withdraw.isLoading ? <Spinner h={2} w={2} /> : "<<"}
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          withdrawals:
          {txs.map((tx) => (
            <Withdrawal txHash={tx} key={tx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BridgeView;
