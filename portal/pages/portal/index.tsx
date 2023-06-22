import Head from "next/head";

import { Center, Flex } from "@chakra-ui/react";

import FeatureCard from "../../src/components/FeatureCard";
import Layout from "../../src/components/layout";
import { AWS_ASSETS_PATH } from "../../src/constants";
import useUser from "../../src/contexts/UserContext";
import NeedAuthorizationView from "../../src/components/NeedAuthorizationView";
import LayoutLanding from "../../src/components/layoutLanding";

const assets = {
  airdrop: `${AWS_ASSETS_PATH}/open-lootbox.png`,
  dropper: `${AWS_ASSETS_PATH}/airdrop.png`,
  terminus: `${AWS_ASSETS_PATH}/Terminus.png`,
  games: `${AWS_ASSETS_PATH}/minigames-card.png`,
};

const features = [
  {
    name: "Terminus",
    description: "Manage your access lists and more",
    image: assets.terminus,
    href: "portal/terminus",
  },
  {
    name: "Dropper",
    description: "Distribute rewards to your players",
    image: assets.dropper,
    href: "portal/dropper",
  },
];

export default function Home() {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <></>;
  }

  return (
    <>
      {!user && (
        <LayoutLanding home={false} title="Moonstream: portal">
          <Flex direction="column" mx="auto" my="40px">
            <NeedAuthorizationView />
            <Flex gap="40px" py="40px" justifyContent="center">
              {features.map((feature) => (
                <FeatureCard feature={feature} key={feature.name} disabled />
              ))}
            </Flex>
          </Flex>
        </LayoutLanding>
      )}
      {user && (
        <Layout home={true}>
          <Head>
            <title>Moonstream portal</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.png" />
          </Head>
          <Center>
            <Flex gap="40px" py="40px" justifyContent="center">
              {features.map((feature) => (
                <FeatureCard feature={feature} key={feature.name} />
              ))}
            </Flex>
          </Center>
        </Layout>
      )}
    </>
  );
}
