import React, { useContext, useEffect, useState } from "react";
import styles from "./BridgeView.module.css";
import { useMutation, useQuery } from "react-query";
const L2_CHAIN_NAME = "Arbitrum sepolia";
const L3_CHAIN_NAME = "Game7 Tesnet Caldera";
// const ACCOUNT = "0x605825459E3e98565827Af31DF4cA854A7cCED28";
// const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? "";

const txs = [
  // "0x8c09f790e614a59e8a792c8e294569262ba4c82276124781678697b180dfc799",
  // "0x2bbfd507eb26a1f0c007345ce122d56000cbd98c45b7a62ca3f1aca629b9f899",
  // "0x9e8222d1ea8f7a55384802ef7aca582e08e582beb53cb03f1daacd1059ae267d",
  // "0x4bf995f8db0500325df77bf912104b6b3b0604a44117dd6bfa47277e0d0ee875",
  // "0xb778a3ec55896616ed033f05227c30ebc73c873f6f80fc999f63c7c3d4eeb6b4",
  // "0x3fada554470e1600d27e70699990f7a77b3f8ee89b9e4b192419a58392d8fb8b",
  // "0x20f1eb781b930193e6fce1069b64712fb42a3855ce09d78abe649ddd66aa907b",
  // "0x02b6cf4313b5bbf2c1242bddbf03a0acefa1ea6200c53015b064db759eeba849",
  // "0x732b7400fecea15dfc40912399311533ac53b1092b8835ec104c4f4efb933211",
  // "0x178f750ac0feb9b50de496ba92f91c708396fc794f767b58e5c48490794f41ef",
  // "0xd0a5c6ff85e7aa5fecd16cffd908f90cd66a83bcf63684a7fde3e1eccdbeed44",
  // "0x6eabeffc7feac528057d5bb307965de3f05b279219430e02b40517b6d3c17438",
  // "0x8f6dc2e0c892bb97465c5e72718519cb88879741f3b33b198053273708d5106b",
  // "0xe7c19970aaded18b26f0d7f2dae3244cf7a09b4c0806c209dba812a3e051b932", //not executed
  // "0xed4a7149543497167d779789d8e79ef6155cf4640556cd5fe26917cbbfff920c",
  // "0x0785921358d1af5f6423d05d0249e93b906aa82fad791d5fe575e715f3d3ffd1",
  "0x478107cfefc8e01c64098c922415f8a5af80c1f5db5d834ad45758ae754d4e74",
];

const txs2 = ["0xe066ad48d0a48a53d47dd1762ebafb8240b1e3ddd4d29479ceb27c11b01b4495"];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require("web3");
const L2_RPC = "https://sepolia-rollup.arbitrum.io/rpc";

import { AbiItem } from "web3-utils";
import importedERC20ABI from "../../web3/abi/MockErc20.json";
const ERC20_ABI = importedERC20ABI as unknown as AbiItem[];
import importedERC20InboxABI from "../../web3/abi/ERC20Inbox.json";
const ERC20_INBOX_ABI = importedERC20InboxABI as unknown as AbiItem[];
import { Flex, Input, Spinner, Text } from "@chakra-ui/react";
import Web3Context from "../../contexts/Web3Context/context";
import { withdrawNativeToken, withdrawNativeToken2 } from "../abiView/bridgeNativeToken";
import Withdrawal from "./Withdrawal";
import EntitySelect from "../entity/EntitySelect";
import AddEntityButton from "../entity/AddEntityButton";
import { AiOutlineSave } from "react-icons/ai";
import { useJournal } from "../../hooks/useJournal";
import useMoonToast from "../../hooks/useMoonToast";
import { TEST_TOKEN_ADDRESS } from "../../constants";
import { L3_NETWORKS, L3NetworkConfiguration } from "../../web3/networks/l3Networks";

// const ERC20_INBOX_ADDRESS = "0xaACd8bE2d9ac11545a2F0817aEE35058c70b44e5";

const BridgeView = () => {
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [withdrawDestination, setWithdrawDestination] = useState<string | undefined>(undefined);
  const [l3Web3, setL3Web3] = useState<typeof Web3>(new Web3(L3_NETWORKS[0].chainInfo.rpcs[0]));
  const l2Web3 = new Web3(L2_RPC);
  const web3ctx = useContext(Web3Context);
  const accounts = useJournal({ tags: ["accounts"] });
  const [l3Network, setL3Network] = useState<L3NetworkConfiguration>(L3_NETWORKS[0]);
  const formatBalance = (symbol: string | undefined, weiBalance: string | undefined) => {
    if (!weiBalance) {
      return "-";
    }
    return `${web3ctx.web3.utils.fromWei(weiBalance, "ether")} ${symbol ?? ""}`;
  };

  useEffect(() => {
    if (withdrawDestination === undefined && web3ctx.account) {
      setWithdrawDestination(web3ctx.account);
    }
  }, [web3ctx.account, withdrawDestination]);

  function convertToBigNumber(numberString: string, precision = 18) {
    const [integerPart, decimalPart] = numberString.split(".");
    const decimalPartPadded = (decimalPart || "").padEnd(precision, "0");
    const bigNumberString = integerPart + decimalPartPadded;
    return web3ctx.web3.utils.toBN(bigNumberString);
  }

  const l2Balance = useQuery(
    ["l2Balance"],
    async () => {
      const ERC20Contract = new l2Web3.eth.Contract(ERC20_ABI);
      ERC20Contract.options.address = TEST_TOKEN_ADDRESS;
      return ERC20Contract.methods.balanceOf(web3ctx.account).call();
    },
    {
      refetchInterval: 5000,
    },
  );

  const l2Symbol = useQuery(["symbol", TEST_TOKEN_ADDRESS], () => {
    const ERC20Contract = new l2Web3.eth.Contract(ERC20_ABI);
    ERC20Contract.options.address = TEST_TOKEN_ADDRESS;
    return ERC20Contract.methods.symbol().call();
  });

  const l3Balance = useQuery(
    ["l3Balance", l3Network],
    () => {
      const l3web3 = new Web3(l3Network.chainInfo.rpcs[0]);
      return l3web3.eth.getBalance(web3ctx.account);
    },
    {
      refetchInterval: 5000,
    },
  );
  const toast = useMoonToast();
  const deposit = useMutation(
    async (amount: string) => {
      const ERC20InboxContract = new web3ctx.web3.eth.Contract(ERC20_INBOX_ABI);
      ERC20InboxContract.options.address = l3Network.coreContracts.inbox;

      const ethAmount = convertToBigNumber(amount);
      const res = await ERC20InboxContract.methods
        .depositERC20(ethAmount)
        .send({ from: web3ctx.account });
      console.log(res);
    },
    {
      onSuccess: () => {
        l2Balance.refetch();
        l3Balance.refetch();
      },
      onError: (e: Error) => {
        toast(`Deposit error - ${e.message}`, "error");
      },
    },
  );

  const withdraw = useMutation(
    async (amount: string) => {
      if (!withdrawDestination) {
        console.log("invalid destination");
        return;
      }
      return withdrawNativeToken2(Number(amount), withdrawDestination);
    },
    {
      onSuccess: (data: any) => {
        console.log(data);
        l3Balance.refetch();
      },
    },
  );

  const handleDepositClick = () => {
    deposit.mutate(depositValue);
  };

  const handleWithdrawClick = () => {
    withdraw.mutate(withdrawValue);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chainContainer}>
        <div className={styles.chainName}>{L2_CHAIN_NAME}</div>
        <div className={styles.balance}>{formatBalance(l2Symbol.data, l2Balance.data) ?? ""}</div>
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
        <select
          className={styles.select}
          value={l3Network.chainInfo.chainId}
          onChange={(e) =>
            setL3Network(
              L3_NETWORKS.find((n) => n.chainInfo.chainId === parseInt(e.target.value)) ??
                l3Network,
            )
          }
        >
          {L3_NETWORKS.map((n) => (
            <option value={n.chainInfo.chainId} key={n.chainInfo.chainId}>
              {n.chainInfo.chainName}
            </option>
          ))}
        </select>
        <div className={styles.balance}>{formatBalance(l2Symbol.data, l3Balance.data) ?? ""}</div>
        <input
          type={"text"}
          value={withdrawValue}
          className={styles.input}
          onChange={(e) => setWithdrawValue(e.target.value)}
          placeholder={"amount"}
        />
        <Flex direction="column" gap="10px">
          <Text variant="label">address</Text>
          <Flex gap={"10px"}>
            <Input
              variant="address"
              fontSize="18px"
              w="45ch"
              borderRadius="10px"
              value={withdrawDestination}
              onChange={(e) => setWithdrawDestination(e.target.value)}
              // borderColor={!showInvalid || isTokenAddressValid ? "white" : "error.500"}
              placeholder="destination"
            />
            {!!accounts?.data && (
              <EntitySelect tags={["accounts"]} onChange={setWithdrawDestination}>
                ...
              </EntitySelect>
            )}
            <button
              className={styles.button}
              onClick={() => setWithdrawDestination(web3ctx.account)}
            >
              wallet
            </button>
          </Flex>
        </Flex>
        <button
          className={styles.button}
          onClick={handleWithdrawClick}
          disabled={!withdrawDestination}
        >
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
