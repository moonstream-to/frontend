import Web3 from "web3";

export interface Wallet {
  name: string;
  downloadURL: string;
  image: string;
  isInstalled: () => boolean;
  connect: (web3: Web3) => Promise<WalletConnection | undefined>;
}

export interface WalletConnection {
  accounts: string[];
  chainId: number;
}

// Shared connect function for wallets using window.ethereum
const connectEthereumWallet = async (web3: Web3): Promise<WalletConnection | undefined> => {
  return await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .then(async () => {
      web3.setProvider(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const chainId = await web3.eth.getChainId();
      return { accounts, chainId };
    })
    .catch((err: any) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log("Please connect to wallet.");
      } else {
        console.error(err);
      }
    });
};

const isEthereumWalletInstalled = (walletCheck: (ethereum: any) => boolean): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    walletCheck(window.ethereum)
  );
};

export const WALLETS: Wallet[] = [
  {
    name: "MetaMask",
    downloadURL: "https://metamask.io/download.html",
    image: "https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png",
    isInstalled: () => isEthereumWalletInstalled((ethereum) => ethereum.isMetaMask),
    connect: connectEthereumWallet,
  },
  {
    name: "Trust Wallet",
    downloadURL: "https://trustwallet.com/",
    image: "https://trustwallet.com/assets/images/home/wallet.png",
    isInstalled: () => isEthereumWalletInstalled((ethereum) => ethereum.isTrust),
    connect: connectEthereumWallet,
  },
  {
    name: "Coinbase Wallet",
    downloadURL: "https://www.coinbase.com/wallet",
    image:
      "https://images.ctfassets.net/q5ulk4bp65r7/4W0EJLE66HwCmSIwKMMOyy/63b5d14d14662d9389df9d7e5c73af86/coinbase-wallet-icon.png",
    isInstalled: () => isEthereumWalletInstalled((ethereum) => ethereum.isCoinbaseWallet),
    connect: connectEthereumWallet,
  },
];
