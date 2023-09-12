import Head from "next/head";

import { Flex, Spacer, useMediaQuery } from "@chakra-ui/react";

import Footer from "./Footer";
import { AWS_STATIC_ASSETS_PATH } from "../constants";
import NavbarLanding from "./NavbarLanding";

export const siteTitle = "Moonstream apps portal";

export default function LayoutLanding({
  children,
  home,
  title,
}: {
  children: React.ReactNode;
  home?: boolean;
  title?: string;
}) {
  const [isSmallPadding] = useMediaQuery(["(min-width: 1024px) and (max-width: 1100px)"]);
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <title>{title ?? "Moonstream portal"}</title>
        <meta
          name="description"
          content="Moonstream provides economic infrastructure for web3 games. Gather actionable data with our web3 data analytics. Act on it with our on-chain mechanics. Watch your economy flourish."
        />
        <meta name="og:title" content={siteTitle} />
        <meta
          name="keywords"
          content="analytics, blockchain analytics, protocol, protocols, blockchain, crypto, data, NFT gaming, smart contracts, web3, smart contract, ethereum, polygon, matic, transactions, defi, finance, decentralized, mempool, NFT, NFTs, DAO, DAOs, cryptocurrency, cryptocurrencies, bitcoin, blockchain economy, blockchain game, marketplace, blockchain security, loyalty program, Ethereum bridge, Ethereum bridges, NFT game, NFT games"
        />
        <meta name="og:image" content={`${AWS_STATIC_ASSETS_PATH}/metadata-image.png`} />
      </Head>
      <Flex minH="100vh" flexDirection="column" justifyContent="start">
        <Flex direction="column">
          <NavbarLanding home={home} px={isSmallPadding ? "4%" : "7%"} />
        </Flex>
        {children}
        <Spacer />
        <Footer home={home} />
      </Flex>
    </div>
  );
}
