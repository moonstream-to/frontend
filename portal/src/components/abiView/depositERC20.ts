import { providers, utils } from "ethers";

import importedERC20InboxABI from "../../web3/abi/ERC20Inbox.json";
import { AbiItem } from "web3-utils";
import { L3NetworkConfiguration } from "../../web3/networks/l3Networks";
import { NODE_INTERFACE_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";
import { NodeInterface__factory } from "@arbitrum/sdk/dist/lib/abi/factories/NodeInterface__factory";
const ERC20_INBOX_ABI = importedERC20InboxABI as unknown as AbiItem[];

const L2_RPC = "https://sepolia-rollup.arbitrum.io/rpc";
const l2Provider = new providers.JsonRpcProvider(L2_RPC);

export const estimateDepositGas = async (
  amount: number,
  account: string,
  l3Network: L3NetworkConfiguration,
  txData: string,
) => {
  const baseL2Provider = new providers.StaticJsonRpcProvider(l3Network.chainInfo.rpcs[0]);
  const destinationAddress = l3Network.coreContracts.inbox;

  const nodeInterfaceABI = [
    {
      inputs: [
        { internalType: "uint64", name: "size", type: "uint64" },
        { internalType: "uint64", name: "leaf", type: "uint64" },
      ],
      name: "constructOutboxProof",
      outputs: [
        { internalType: "bytes32", name: "send", type: "bytes32" },
        { internalType: "bytes32", name: "root", type: "bytes32" },
        { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "uint256", name: "deposit", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "l2CallValue", type: "uint256" },
        { internalType: "address", name: "excessFeeRefundAddress", type: "address" },
        { internalType: "address", name: "callValueRefundAddress", type: "address" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "estimateRetryableTicket",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint64", name: "blockNum", type: "uint64" }],
      name: "findBatchContainingBlock",
      outputs: [{ internalType: "uint64", name: "batch", type: "uint64" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "bool", name: "contractCreation", type: "bool" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "gasEstimateComponents",
      outputs: [
        { internalType: "uint64", name: "gasEstimate", type: "uint64" },
        { internalType: "uint64", name: "gasEstimateForL1", type: "uint64" },
        { internalType: "uint256", name: "baseFee", type: "uint256" },
        { internalType: "uint256", name: "l1BaseFeeEstimate", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "bool", name: "contractCreation", type: "bool" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "gasEstimateL1Component",
      outputs: [
        { internalType: "uint64", name: "gasEstimateForL1", type: "uint64" },
        { internalType: "uint256", name: "baseFee", type: "uint256" },
        { internalType: "uint256", name: "l1BaseFeeEstimate", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes32", name: "blockHash", type: "bytes32" }],
      name: "getL1Confirmations",
      outputs: [{ internalType: "uint64", name: "confirmations", type: "uint64" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "batchNum", type: "uint256" },
        { internalType: "uint64", name: "index", type: "uint64" },
      ],
      name: "legacyLookupMessageBatchProof",
      outputs: [
        { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
        { internalType: "uint256", name: "path", type: "uint256" },
        { internalType: "address", name: "l2Sender", type: "address" },
        { internalType: "address", name: "l1Dest", type: "address" },
        { internalType: "uint256", name: "l2Block", type: "uint256" },
        { internalType: "uint256", name: "l1Block", type: "uint256" },
        { internalType: "uint256", name: "timestamp", type: "uint256" },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "bytes", name: "calldataForL1", type: "bytes" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nitroGenesisBlock",
      outputs: [{ internalType: "uint256", name: "number", type: "uint256" }],
      stateMutability: "pure",
      type: "function",
    },
  ];

  console.log({ amount, from: account, to: l3Network.coreContracts.inbox, txData });

  const gasEstimator = async () => {
    // addDefaultLocalNetwork();

    // Instantiation of the NodeInterface object
    const nodeInterface = NodeInterface__factory.connect(NODE_INTERFACE_ADDRESS, l2Provider);

    // Getting the estimations from NodeInterface.GasEstimateComponents()
    // ------------------------------------------------------------------
    console.log("qq");
    const gasEstimateComponents = await nodeInterface.callStatic.gasEstimateComponents(
      destinationAddress,
      false,
      txData,
      {
        from: account,
      }
    );
    console.log(gasEstimateComponents);

    // Getting useful values for calculating the formula
    const l1GasEstimated = gasEstimateComponents.gasEstimateForL1;
    const l2GasUsed = gasEstimateComponents.gasEstimate.sub(gasEstimateComponents.gasEstimateForL1);
    const l2EstimatedPrice = gasEstimateComponents.baseFee;
    const l1EstimatedPrice = gasEstimateComponents.l1BaseFeeEstimate.mul(16);

    // Calculating some extra values to be able to apply all variables of the formula
    // -------------------------------------------------------------------------------
    // NOTE: This one might be a bit confusing, but l1GasEstimated (B in the formula) is calculated based on l2 gas fees
    const l1Cost = l1GasEstimated.mul(l2EstimatedPrice);
    // NOTE: This is similar to 140 + utils.hexDataLength(txData);
    const l1Size = l1Cost.div(l1EstimatedPrice);

    // Getting the result of the formula
    // ---------------------------------
    // Setting the basic variables of the formula
    const P = l2EstimatedPrice;
    const L2G = l2GasUsed;
    const L1P = l1EstimatedPrice;
    const L1S = l1Size;

    // L1C (L1 Cost) = L1P * L1S
    const L1C = L1P.mul(L1S);

    // B (Extra Buffer) = L1C / P
    const B = L1C.div(P);

    // G (Gas Limit) = L2G + B
    const G = L2G.add(B);

    // TXFEES (Transaction fees) = P * G
    const TXFEES = P.mul(G);

    console.log("Gas estimation components");
    console.log("-------------------");
    console.log(`Full gas estimation = ${gasEstimateComponents.gasEstimate.toNumber()} units`);
    console.log(`L2 Gas (L2G) = ${L2G.toNumber()} units`);
    console.log(`L1 estimated Gas (L1G) = ${l1GasEstimated.toNumber()} units`);

    console.log(`P (L2 Gas Price) = ${utils.formatUnits(P, "gwei")} gwei`);
    console.log(
      `L1P (L1 estimated calldata price per byte) = ${utils.formatUnits(L1P, "gwei")} gwei`,
    );
    console.log(`L1S (L1 Calldata size in bytes) = ${L1S} bytes`);

    console.log("-------------------");
    console.log(`Transaction estimated fees to pay = ${utils.formatEther(TXFEES)} ETH`);
  };
  return gasEstimator();
};
