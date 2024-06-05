import React, { useState } from "react";
import { Wallet } from "./wallets";
import styles from "./WalletsList.module.css";
import Web3 from "web3";

interface WalletButtonProps {
  wallet: Wallet;
}

const WalletButton: React.FC<WalletButtonProps> = ({ wallet }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const web3 = new Web3();

  const handleConnect = async () => {
    if (wallet.isInstalled()) {
      const connection = await wallet.connect(web3);
      if (connection) {
        setAddress(connection?.accounts[0]);
        setConnected(true);
      }
    } else {
      window.open(wallet.downloadURL, "_blank");
    }
  };

  return (
    <button
      onClick={handleConnect}
      style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
    >
      {connected ? (
        <div className={styles.walletName}>Connected: {address}</div>
      ) : (
        <>
          <div className={styles.walletName}>
            {`${wallet.isInstalled() ? "Connect to" : "Install"} ${wallet.name}`}
          </div>
        </>
      )}
    </button>
  );
};

export default WalletButton;
