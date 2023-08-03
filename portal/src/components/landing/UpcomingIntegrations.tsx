import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

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
    h: 43,
  },
  {
    name: "optimism",
    href: "https://www.optimism.io/",
    h: 19,
  },
  {
    name: "evmos",
    href: "https://evmos.org/",
    h: 23,
  },
  {
    name: "arbitrum",
    href: "https://arbitrum.io/",
    h: 23,
  },
];

const UpcomingIntegrations = ({ ...props }) => {
  return (
    <Flex
      direction="column"
      borderRadius="40px"
      border="1px solid white"
      p={{ base: "30px 30px", sm: "40px 60px" }}
      gap={{ base: "30px", sm: "40px" }}
      justifyContent="center"
      textAlign="center"
    >
      <Text fontSize="30px" fontWeight="700">
        Looking for another EVM blockchain integration?
      </Text>
      <Text fontSize="18px" mt="-10px">
        Contact us, we can add it in a couple of days.
      </Text>
      <Flex
        wrap="wrap"
        justifyContent="center"
        columnGap={{ base: "20px", sm: "40px" }}
        // h="61px"
        alignItems="center"
      >
        {chains.map((chain) => (
          <Link href={chain.href} isExternal key={chain.name}>
            <Image
              src={assets[chain.name as keyof typeof assets]}
              alt={chain.name}
              filter="invert(100%)"
              h={{ base: `${chain.h}px`, sm: `${chain.h * 1.45}px` }}
            />
          </Link>
        ))}
      </Flex>
      <Link isExternal href="https://discord.gg/K56VNUQGvA">
        <Button variant="whiteOutline">Ask on Discord</Button>
      </Link>
    </Flex>
  );
};

export default UpcomingIntegrations;
