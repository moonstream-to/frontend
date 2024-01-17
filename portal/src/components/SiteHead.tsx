import Head from "next/head";

import { AWS_STATIC_ASSETS_PATH, siteTitle } from "../constants";

const SiteHead = ({ title }: { title?: string }) => {
  return (
    <Head>
      <link rel="icon" href="/favicon.png" />
      <title>{title ?? "Moonstream portal"}</title>
      <meta
        name="description"
        content="Automate rewarding players for their on-chain and off-chain activity."
      />
      <meta name="og:title" content={siteTitle} />
      <meta
        name="keywords"
        content="analytics, blockchain analytics, protocol, protocols, blockchain, crypto, data, NFT gaming, smart contracts, web3, smart contract, ethereum, polygon, matic, transactions, defi, finance, decentralized, mempool, NFT, NFTs, DAO, DAOs, cryptocurrency, cryptocurrencies, bitcoin, blockchain economy, blockchain game, marketplace, blockchain security, loyalty program, Ethereum bridge, Ethereum bridges, NFT game, NFT games"
      />
      <meta name="og:image" content={`${AWS_STATIC_ASSETS_PATH}/landing/metadata-image.png`} />
    </Head>
  );
};

export default SiteHead;
