const Web3 = require("web3");

// Set up Web3 instances for L3 and L2 networks
const web3L3 = new Web3("https://game7-testnet-custom.rpc.caldera.xyz/http"); // Replace with your L3 RPC URL
const web3L2 = new Web3("https://sepolia-rollup.arbitrum.io/rpc"); // Replace with your L2 RPC URL

// Bridge contract addresses and ABIs for L3 and L2
const l3Contracts = {
  customGateway: "0x54C38DBDb0318653E3D1dFf698C245eD35C3bB96",
  multicall: "0xD3e2587aDF118364EA931235BEAe4CeDFAa1d644",
  proxyAdmin: "0xB7D8c3Bba729E12F4CDd54c4C492cFA962cFcE6E",
  router: "0xc5966E3958E55bAD8A3D6E71753dCE2DFfcc7e15",
  standardGateway: "0x8E57DeB813cD10c5303e97ca2fdE5C33463CaFDC",
  weth: "0x0000000000000000000000000000000000000000",
  wethGateway: "0x0000000000000000000000000000000000000000",
};

const l2Contracts = {
  customGateway: "0xeA7f73a6fFA8d08CB8FCFE12e58CF4951CD9f818",
  multicall: "0x3AFeb1Ea760EED35D224C531D531C30eC6aE13e5",
  proxyAdmin: "0xF80296627bc317A4A93801c9761B82A754882029",
  router: "0x378f8B8727F4741b9404D6fF3A9D74cb662bF58D",
  standardGateway: "0xE763bC0e5978f264b3F3F5787D58Dc531649e641",
  weth: "0x0000000000000000000000000000000000000000",
  wethGateway: "0x0000000000000000000000000000000000000000",
};
const L2TokenAddress = "0x5f88d811246222F6CB54266C42cc1310510b9feA";

// User's address and private key (never hardcode private keys in production)
const userAddress = "0x605825459E3e98565827Af31DF4cA854A7cCED28"; // Replace with the user's wallet address
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? ""; // Replace with the user's private key

// Bridge contract ABI (example)
const bridgeContractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_l1Token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "outboundTransfer",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

// Function to bridge native tokens from L3 to L2
export async function bridgeERC20(amount: Number) {
  try {
    const bridgeContractL3 = new web3L3.eth.Contract(bridgeContractABI, l3Contracts.router);
    const amountInWei = web3L3.utils.toWei(amount.toString(), "noether");

    // Step 1: Initiate the transfer from L3 to L2
    const bridgeData = bridgeContractL3.methods
      .outboundTransfer(L2TokenAddress, userAddress, amount, "0x")
      .encodeABI();
    const bridgeTx = {
      from: userAddress,
      to: l3Contracts.router,
      data: bridgeData,
      value: amountInWei, // Native token amount to transfer
      gas: 300000,
    };

    const signedBridgeTx = await web3L3.eth.accounts.signTransaction(bridgeTx, privateKey);
    const receipt = await web3L3.eth.sendSignedTransaction(signedBridgeTx.rawTransaction);

    console.log("Transfer successful:", receipt);
  } catch (error) {
    console.error("Error bridging native tokens:", error);
  }
}

// Example usage
// const amountToBridge = web3L3.utils.toWei('1', 'ether'); // Replace with the amount you want to bridge
// bridgeNativeTokens(1);
