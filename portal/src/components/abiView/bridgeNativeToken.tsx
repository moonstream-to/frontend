import { L2ToL1MessageStatus, L2ToL1MessageWriter, L2TransactionReceipt } from "@arbitrum/sdk";
import { ethers, providers, Signer, Wallet } from "ethers";

const Web3 = require("web3");

const L3_RPC = "https://game7-testnet-custom.rpc.caldera.xyz/http";
const L2_RPC = "https://sepolia-rollup.arbitrum.io/rpc";
// Replace with your L3 node URL
const web3 = new Web3(L3_RPC);
const l3Provider = new providers.JsonRpcProvider(L3_RPC);
const l2Provider = new providers.JsonRpcProvider(L2_RPC);

// Replace with the actual address of the ArbSys contract on your L3 network
const arbSysAddress = "0x0000000000000000000000000000000000000064";

// Define the ABI for the ArbSys contract
const arbSysABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "destination",
        type: "address",
      },
    ],
    name: "withdrawEth",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

const outboxABI = [
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "l2Sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "l2Block",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "l1Block",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "l2Timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "executeTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Create an instance of the ArbSys contract
const arbSysContract = new web3.eth.Contract(arbSysABI, arbSysAddress);

// Replace with the address you want to send the native token to
const destAddress = "0x605825459E3e98565827Af31DF4cA854A7cCED28";

// Replace with your L3 wallet address and private key
const userAddress = "0x605825459E3e98565827Af31DF4cA854A7cCED28";
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? "";

const l2wallet = new Wallet(privateKey, l2Provider);

// Function to withdraw native tokens
export const withdrawNativeToken = async (amountInNative: number, destination: string) => {
  const amountInWei = web3.utils.toWei(amountInNative.toString(), "ether"); // Adjust if your token has different decimal units

  // Create the transaction data
  const txData = arbSysContract.methods.withdrawEth(destination).encodeABI(); // Replace with your specific function if different

  // Get the transaction count to use as nonce
  const nonce = await web3.eth.getTransactionCount(userAddress);

  // Create the transaction object
  const tx = {
    from: userAddress,
    to: arbSysAddress,
    value: amountInWei,
    gas: 300000, // Adjust the gas limit as needed
    data: txData,
    nonce: nonce,
  };

  // Sign the transaction
  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  // Send the signed transaction
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("Transaction receipt:", receipt);
  console.log("Transaction hash:", receipt.transactionHash);
  return receipt.transactionHash;
};

export const withdrawNativeToken2 = async (amountInNative: number, destination: string) => {
  const amountInWei = web3.utils.toWei(amountInNative.toString(), 'ether');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const arbSysContract = new ethers.Contract(arbSysAddress, arbSysABI, signer);
  const tx = await arbSysContract.populateTransaction.withdrawEth(destination, {
    value: amountInWei,
  });
  tx.gasLimit = ethers.BigNumber.from("300000");

  try {
    const txResponse = await signer.sendTransaction(tx);
    console.log("Transaction response:", txResponse);
    const receipt = await txResponse.wait();
    console.log("Transaction receipt:", receipt);
    console.log("Transaction hash:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error("Transaction failed:", error);
  }
};

export const getReceipt = async (txHash: string) => {
  const receipt = await web3.eth.getTransactionReceipt(txHash);
  // if (receipt.confirmations == null) {
  //   // const blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
  //
  //   // Add the confirmations using the fast block number (pessimistic)
  //   let confirmations = (blockNumber - receipt.blockNumber) + 1;
  //   if (confirmations <= 0) { confirmations = 1; }
  //   receipt.confirmations = confirmations;
  // }
  const l2Receipt = new L2TransactionReceipt(receipt);

  /**
   * Note that in principle, a single transaction could trigger any number of outgoing messages; the common case will be there's only one.
   * For the sake of this script, we assume there's only one / just grad the first one.
   */
  const messages: L2ToL1MessageWriter[] = await l2Receipt.getL2ToL1Messages(l2wallet);
  const l2ToL1Msg: L2ToL1MessageWriter = messages[0];
  let executed = false;
  console.log(web3);
  const status = await l2ToL1Msg.status(l3Provider);
  if (status === L2ToL1MessageStatus.EXECUTED) {
    executed = true;
    console.log(`Message already executed! Nothing else to do here`);
    return;
  }
  console.log(receipt, messages, status, `executed: ${executed}`);
  const timeToWaitMs = 1000 * 60;
  console.log(
    "Waiting for the outbox entry to be created. This only happens when the L2 block is confirmed on L1, ~1 week after it's creation.",
  );
  if (!executed) {
    await l2ToL1Msg.waitUntilReadyToExecute(l3Provider, timeToWaitMs);
  }
  console.log("Outbox entry exists! Trying to execute now");
  const res = await l2ToL1Msg.execute(l3Provider);
  const rec = await res.wait();
  console.log("Done! Your transaction is executed", rec);
};

// Example usage
// const amountToWithdraw = 1; // Amount in your native token to withdraw
// withdrawNativeToken(amountToWithdraw).catch(console.error);

//0x8c09f790e614a59e8a792c8e294569262ba4c82276124781678697b180dfc799 1st hash
