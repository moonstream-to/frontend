import React from "react";
import styles from "./WalletsList.module.css";
import { Wallet } from "./wallets";
import WalletButton from "./WalletButton";

interface WalletsListProps {
  wallets: Wallet[];
}
const WalletsList: React.FC<WalletsListProps> = ({ wallets }) => {
  return (
    <div className={styles.container}>
      {wallets && wallets.map((w) => <WalletButton key={w.name} wallet={w} />)}
    </div>
  );
};

export default WalletsList;
