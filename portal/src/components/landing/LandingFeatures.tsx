import RouterLink from "next/link";

import { Flex, Link, Text, Button, Image, useMediaQuery, Box } from "@chakra-ui/react";
import FeatureCard from "../FeatureCard";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";
import LandingFeatureCard from "./LandingFeatureCard";
import styles from "./LandingFeatures.module.css";

const arrows = {
  downRight: `${AWS_STATIC_ASSETS_PATH}/landing/icons/arrow-right-to-left.svg`,
  upRight: `${AWS_STATIC_ASSETS_PATH}/landing/icons/arrow-left-to-right.svg`,
  up: `${AWS_STATIC_ASSETS_PATH}/landing/icons/arrow-up.svg`,
  left: `${AWS_STATIC_ASSETS_PATH}/landing/icons/arrow-left.svg`,
};

export const MoonstreamFeatures = [
  {
    name: "Analytics",
    description: "Measure your players’<br /> on&#x2011;chain and off&#x2011;chain activities.",
    image: `${AWS_STATIC_ASSETS_PATH}/analytics-card.png`,
    href: "/features/#analytics",
  },
  {
    name: "Leaderboards",
    description:
      "Rank players by engagement. Create sinks by assigning scores to token specific in-game actions.",
    image: `${AWS_STATIC_ASSETS_PATH}/Leaderboards.png`,
    href: "/features/#leaderboards",
  },
  {
    name: "Drops",
    description: "Distribute on-chain rewards to the players at the top of your leaderboards.",
    image: `${AWS_STATIC_ASSETS_PATH}/airdrop.png`,
    href: "features/#drops",
  },
];

const LandingFeatures = () => {
  const [isSmallScreen] = useMediaQuery(["(max-width: 767px)"]);
  return (
    <Flex
      py={{ base: "40px", sm: "80px" }}
      px="7%"
      gap={{ base: "40px", sm: "60px" }}
      direction="column"
      alignItems="center"
    >
      <Flex direction="column" gap={{ base: "20px", sm: "40px" }} alignItems="center">
        <Text fontSize={{ base: "30px", sm: "40px" }} fontWeight="700" textAlign="center">
          All you need to reward your players
        </Text>
        <Text w={["100%", "100%", "70%"]} textAlign="center" fontFamily={'"Inter", sans-serif'}>
          Gain control over token inflation and reward your players for improving your game.
        </Text>
      </Flex>
      <Flex
        direction={"column"}
        gap={{ base: "10px", sm: "50px" }}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box position={"relative"}>
          <LandingFeatureCard
            feature={MoonstreamFeatures[1]}
            isMainCard
            maxW={{ base: "275px", sm: "297px", md: "463px" }}
          />
          {!isSmallScreen && (
            <>
              <Image
                position="absolute"
                left="-30px"
                h={"30px"}
                w={"30px"}
                alt={"left"}
                src={arrows.up}
                className={styles.upRightImage}
              />
              <Image
                position="absolute"
                left="100%"
                h={"30px"}
                w={"30px"}
                alt={"left"}
                src={arrows.up}
                className={styles.downRightImage}
              />
            </>
          )}
        </Box>
        {isSmallScreen && (
          <Image h={"30px"} w={"30px"} alt={"up"} src={arrows.up} transform={"rotate(180deg)"} />
        )}
        <Flex direction={{ base: "column", sm: "row" }} gap={"10px"} alignItems={"center"}>
          <LandingFeatureCard feature={MoonstreamFeatures[0]} flex={"1"} />
          {isSmallScreen ? (
            <Image h={"30px"} w={"30px"} alt={"up"} src={arrows.up} transform={"rotate(180deg)"} />
          ) : (
            <Image h={"30px"} w={"30px"} alt={"left"} src={arrows.left} />
          )}
          <LandingFeatureCard feature={MoonstreamFeatures[2]} flex={"1"} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LandingFeatures;
