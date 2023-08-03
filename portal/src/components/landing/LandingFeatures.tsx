import RouterLink from "next/link";

import { Flex, Link, Text, Button } from "@chakra-ui/react";
import FeatureCard from "../FeatureCard";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

export const MoonstreamFeatures = [
  {
    name: "Analytics",
    description: "Monitor on- and off-chain player activity",
    image: `${AWS_STATIC_ASSETS_PATH}/analytics-card.png`,
    href: "/features/#analytics",
  },
  {
    name: "Leaderboards",
    description: "Assign scores to player activity",
    image: `${AWS_STATIC_ASSETS_PATH}/Terminus.png`,
    href: "/features/#leaderboards",
  },
  {
    name: "Drops",
    description: "Automate on-chain rewards for leaderboard positions",
    image: `${AWS_STATIC_ASSETS_PATH}/airdrop.png`,
    href: "features/#drops",
  },
];

const LandingFeatures = () => {
  return (
    <Flex
      py={{ base: "40px", sm: "80px" }}
      px="0"
      gap={{ base: "40px", sm: "60px" }}
      direction="column"
      alignItems="center"
    >
      <Flex direction="column" gap={{ base: "20px", sm: "40px" }} alignItems="center">
        <Text fontSize={{ base: "30px", sm: "40px" }} fontWeight="700">
          Features
        </Text>
        <Text w={["100%", "100%", "70%"]} textAlign="center">
          Slowed down by building your own tools for web3 game economy design? Don’t be, Moonstream
          already has game design tools that you can use.
        </Text>
      </Flex>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "20px", sm: "40px" }}
        justifyContent="center"
        alignItems="center"
      >
        {MoonstreamFeatures.map((f, idx) => (
          <FeatureCard key={idx} feature={f} />
        ))}
      </Flex>
      <Flex direction={{ base: "column", sm: "row" }} gap="20px" alignItems="center">
        <RouterLink href="/features">
          <Button variant="plainOrange">Learn more about our features</Button>
        </RouterLink>
        <Link href="https://docs.google.com/document/d/1mjfF8SgRrAZvtCVVxB2qNSUcbbmrH6dTEYSMfHKdEgc/view">
          <Button variant="whiteOutline">Explore the use cases</Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default LandingFeatures;
