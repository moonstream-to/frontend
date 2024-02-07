import Head from "next/head";

import { Center, Flex, Text } from "@chakra-ui/react";

import FeatureCard from "../../src/components/FeatureCard";
import Layout from "../../src/components/layout";
import { AWS_ASSETS_PATH, AWS_ASSETS_PATH_CF } from "../../src/constants";
import useUser from "../../src/contexts/UserContext";
import NeedAuthorizationView from "../../src/components/NeedAuthorizationView";
import LayoutLanding from "../../src/components/layoutLanding";

const assets = {
  airdrop: `${AWS_ASSETS_PATH_CF}/open-lootbox.png`,
  dropper: `${AWS_ASSETS_PATH_CF}/airdrop.png`,
  leaderboard: `${AWS_ASSETS_PATH_CF}/minigame.png`,
  terminus: `${AWS_ASSETS_PATH_CF}/Terminus.png`,
  games: `${AWS_ASSETS_PATH_CF}/gofp-card.png`,
  analytics: `${AWS_ASSETS_PATH}/analytics-card.png`,
};

const features = [
  {
    name: "Analytics",
    description: "Make informed decisions for your crypto gaming experience",
    image: assets.analytics,
    href: "portal/analytics",
  },
  {
    name: "Drops",
    description: "Manage loyalty programs and distribute player rewards",
    image: assets.dropper,
    href: "portal/dropper",
  },
  {
    name: "Leaderboards",
    description: "Automatically create and maintain leaderboards for on-chain activities",
    image: assets.leaderboard,
    href: "portal/leaderboard",
  },
];

const tools = [
  {
    name: "Terminus",
    description: "Create tokens with built-in permissions for game items, badges and more",
    image: assets.terminus,
    href: "portal/terminus",
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
          <Flex direction="column" mx="auto" my="40px" gap="30px">
            <NeedAuthorizationView />
            <Text textAlign="center" variant="title">
              Products
            </Text>

            <Flex gap="40px" py="10px" justifyContent="center">
              {features.map((feature) => (
                <FeatureCard feature={feature} key={feature.name} disabled />
              ))}
            </Flex>
            <Text textAlign="center" variant="title">
              Tools
            </Text>
            <Flex gap="40px" py="10px" justifyContent="center">
              {tools.map((feature) => (
                <FeatureCard feature={feature} key={feature.name} />
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
            <Flex direction="column" mx="auto" my="40px" gap="30px">
              <Text variant="title" textAlign="center">
                Products
              </Text>
              <Flex gap="40px" py="40px" justifyContent="center">
                {features.map((feature) => (
                  <FeatureCard feature={feature} key={feature.name} />
                ))}
              </Flex>
              <Text textAlign="center" variant="title">
                Tools
              </Text>
              <Flex gap="40px" py="10px" justifyContent="center">
                {tools.map((feature) => (
                  <FeatureCard feature={feature} key={feature.name} />
                ))}
              </Flex>
            </Flex>
          </Center>
        </Layout>
      )}
    </>
  );
}
