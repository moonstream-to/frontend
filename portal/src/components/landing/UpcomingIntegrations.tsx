import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH, DISCORD_LINK } from "../../constants";

const assets = {
  forte: `${AWS_STATIC_ASSETS_PATH}/logos/forte-logo.png`,
  optimism: `${AWS_STATIC_ASSETS_PATH}/logos/optimis-logo.png`,
  evmos: `${AWS_STATIC_ASSETS_PATH}/logos/evmos-logo.png`,
  arbitrum: `${AWS_STATIC_ASSETS_PATH}/logos/arbitrum-logo.png`,
};

const chains = [
  {
    name: "forte",
    href: "https://www.forte.io/",
    h: 42,
  },
  {
    name: "optimism",
    href: "https://www.optimism.io/",
    h: 19,
  },
  {
    name: "evmos",
    href: "https://evmos.org/",
    h: 18,
  },
  {
    name: "arbitrum",
    href: "https://arbitrum.io/",
    h: 22,
  },
];

const UpcomingIntegrations = ({ ...props }) => {
  return (
    <Flex
      direction="column"
      borderRadius="40px"
      border="1px solid white"
      p={{ base: "30px 30px", sm: "20px 20px" }}
      gap={{ base: "30px", sm: "20px" }}
      justifyContent="center"
      textAlign="center"
      bg={"#232323"}
      w={"100%"}
      maxW={"1440px"}
    >
      <Text fontSize={{ base: "18px", sm: "24px" }} fontWeight="700">
        Looking for another EVM blockchain integration?
      </Text>
      <Text fontSize={{ base: "14px", sm: "16px" }} mt="-10px">
        <Link isExternal href={DISCORD_LINK} textDecoration="underline">
          Contact us
        </Link>
        , we can add it in a couple of days.
      </Text>
      <Flex
        wrap="wrap"
        justifyContent="center"
        columnGap={{ base: "20px", sm: "40px" }}
        rowGap={"20px"}
        // h="61px"
        alignItems="center"
      >
        {chains.map((chain) => (
          <Link href={chain.href} isExternal key={chain.name}>
            <Image
              src={assets[chain.name as keyof typeof assets]}
              alt={chain.name}
              h={{ base: `${chain.h}px`, sm: `${chain.h * 1.1}px` }}
            />
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export default UpcomingIntegrations;
