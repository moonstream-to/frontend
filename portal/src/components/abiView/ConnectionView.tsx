import React, { useEffect } from "react";
import styles from "./ConnectionView.module.css";
import { Connector, useChains, useConnections, useConnectors, useDisconnect } from "wagmi";
import { connect } from "@wagmi/core";
import { wagmiConfig } from "../../wallets/config";
import { injected } from "wagmi/connectors";
import { MetaMaskSDK } from "@metamask/sdk";
import { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import { getNetwork } from "@ethersproject/networks";

const ConnectionView = () => {
  const connections = useConnections();
  const connectors = useConnectors();
  const supportedChains = useChains();

  // const { disconnect } = useDisconnect();

  const connectWallet = (connector: Connector) => {
    // if
    connector.connect();
  };

  const chainName = (id: number): string => {
    const networkName = supportedChains.find((ch) => ch.id === id)?.name;
    return networkName ?? `chainId: ${id}`;
  };

  useEffect(() => {
    console.log(connectors, connections);
  }, [connectors]);

  return (
    <div className={styles.container}>
      <div className={styles.clientHeader}>Wallets</div>
      {connectors
        .filter((c) => c.name !== "Injected")
        .map((c, idx) => (
          <button type={"button"} onClick={() => connectWallet(c)} key={idx}>
            {c.name}
          </button>
        ))}
      <div style={{ height: "50px", width: "100px" }} />
      {connections
        .filter((c) => c.connector.name !== "Injected")
        .map((c, idx) => (
          <div className={styles.connected} key={idx}>
            <div className={styles.connectionHeader}>
              <div className={styles.connectorName}>{c.connector.name}</div>
              <img className={styles.connectorIcon} alt={""} src={c.connector.icon} />{" "}
            </div>
            <div className={styles.connection}>
              <div className={styles.chain}>{chainName(c.chainId)}</div>
              {c.accounts.map((a) => (
                <div key={a} className={styles.account}>
                  {a}
                </div>
              ))}
            </div>
            <button className={styles.disconnectButton} onClick={() => c.connector.disconnect()}>
              disconnect
            </button>
          </div>
        ))}
    </div>
  );
};

export default ConnectionView;
