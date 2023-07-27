import Head from "next/head";

import { Flex, Spacer } from "@chakra-ui/react";

import BreadcrumbView from "./BreadcrumbView";
import Footer from "./Footer";
import Navbar from "./Navbar";
import useUser from "../contexts/UserContext";
import NeedAuthorizationView from "./NeedAuthorizationView";

const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`;

export const siteTitle = "Moonstream apps portal";

export default function Layout({
  children,
  home,
  title,
  needAuthorization = true,
  showBreadcrumb = true,
}: {
  children: React.ReactNode;
  home?: boolean;
  title?: string;
  needAuthorization?: boolean;
  showBreadcrumb?: boolean;
}) {
  const { user, isLoading } = useUser();
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
        <meta name="og:image" content={`${AWS_ASSETS_PATH}/metadata-image.png`} />
      </Head>
      <Flex minH="100vh" flexDirection="column" justifyContent="start">
        <Flex direction="column">
          <Navbar home={home} px="7%" />
          {showBreadcrumb && <BreadcrumbView />}
        </Flex>
        {user || !needAuthorization ? children : isLoading ? "" : <NeedAuthorizationView />}
        <Spacer />
        <Footer home={home} />
      </Flex>
    </div>
  );
}
