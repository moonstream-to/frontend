import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const assets = {
  championsAscension: `${AWS_STATIC_ASSETS_PATH}/logos/champions-ascension-logo.png`,
  cryptoGuilds: `${AWS_STATIC_ASSETS_PATH}/logos/crypto-guilds-logo.png`,
  cryptoUnicorns: `${AWS_STATIC_ASSETS_PATH}/logos/crypto-unicorns-logo.png`,
  game7io: `${AWS_STATIC_ASSETS_PATH}/logos/game7-logo.png`,
  metaboy: `${AWS_STATIC_ASSETS_PATH}/logos/metaboy-logo.png`,
  opGames: `${AWS_STATIC_ASSETS_PATH}/logos/op-games-logo.png`,
  orangedao: `${AWS_STATIC_ASSETS_PATH}/logos/orange-dao-logo.png`,
  worlds: `${AWS_STATIC_ASSETS_PATH}/logos/worlds-logo.png`,
  caldera: `${AWS_STATIC_ASSETS_PATH}/logos/caldera-logo.png`,
  etherium: `${AWS_STATIC_ASSETS_PATH}/logos/eth-logo.png`,
  gnosis: `${AWS_STATIC_ASSETS_PATH}/logos/gnosis-logo.png`,
  polygon: `${AWS_STATIC_ASSETS_PATH}/logos/polygon-logo.png`,
  mumbai: `${AWS_STATIC_ASSETS_PATH}/logos/polygon-logo.png`,
};

const trustedBy = [
  {
    name: "Champions Ascension",
    img: assets["championsAscension"],
    href: "https://www.champions.io/",
    h: { base: "20px", sm: "28px" },
  },
  {
    name: "Crypto Guilds",
    img: assets["cryptoGuilds"],
    href: "https://crypto-guilds.com/",
    h: { base: "19px", sm: "27px" },
  },
  {
    name: "Crypto Unicorns",
    img: assets["cryptoUnicorns"],
    href: "https://www.cryptounicorns.fun/",
    h: { base: "33px", sm: "47px" },
  },
  {
    name: "metaboy",
    img: assets["metaboy"],
    href: "https://metaboy.run/",
    h: { base: "14px", sm: "20px" },
  },
  {
    name: "game7io",
    img: assets["game7io"],
    href: "https://game7.io/",
    h: { base: "10px", sm: "15px" },
  },
  {
    name: "opGame",
    img: assets["opGames"],
    href: "https://opgames.org",
    h: { base: "35px", sm: "50px" },
  },
  {
    name: "orangedao",
    img: assets["orangedao"],
    href: "https://lfg.orangedao.xyz/",
    h: { base: "31px", sm: "44px" },
  },
  {
    name: "worlds",
    img: assets["worlds"],
    href: "https://worlds.org",
    h: { base: "9px", sm: "13px" },
  },
];

const chains = [
  {
    name: "caldera",
    href: "https://caldera.xyz/",
  },
  {
    name: "etherium",
    href: "https://ethereum.org/",
  },
  {
    name: "gnosis",
    href: "https://www.gnosis.io/",
  },
  {
    name: "polygon",
    href: "https://polygon.technology/",
  },
  {
    name: "mumbai",
    href: "https://mumbai.polygonscan.com/",
  },
];

const TrustedBy = ({ ...props }) => {
  return (
    <Flex
      direction="column"
      borderRadius="20px"
      bg="white"
      p={{ base: "40px 20px", sm: "60px 60px" }}
      gap={{ base: "40px", sm: "60px" }}
      fontSize="24px"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Flex direction="column" gap={{ base: "30px", sm: "40px" }}>
        <Text fontWeight={{ base: "700", sm: "600" }} color={{ base: "black", sm: "#1A1D22" }}>
          Trusted by visionaries in the industry
        </Text>
        <Flex
          wrap="wrap"
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap="20px"
          columnGap={{ base: "20px", sm: "40px" }}
          rowGap={{ base: "20px" }}
          maxW="700px"
          mb={{ base: "10px", sm: "20px" }}
        >
          {trustedBy.map((f) => (
            <Link href={f.href} key={f.name} target="_blank">
              <Image
                src={f.img}
                alt={f.name}
                alignSelf="center"
                justifySelf="center"
                h={{ base: f.h.base, sm: f.h.sm }}
              />
            </Link>
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" gap={{ base: "30px", sm: "40px" }}>
        <Text fontWeight={{ base: "700", sm: "600" }} color={{ base: "black", sm: "#1A1D22" }}>
          Supported Blockchains
        </Text>

        <Flex
          wrap="wrap"
          justifyContent="center"
          columnGap={{ base: "20px", sm: "40px" }}
          rowGap={{ base: "15px, sm: 20px" }}
          maxW="510px"
        >
          {chains.map((chain) => (
            <Link href={chain.href} key={chain.name} target="_blank">
              <Flex gap="6px" alignItems="center">
                <Box w={{ base: "28px", sm: "40px" }} h={{ base: "28px", sm: "40px" }}>
                  <Image src={assets[chain.name as keyof typeof assets]} alt={chain.name} />
                </Box>
                <Text
                  color="#1A1D22"
                  textTransform="uppercase"
                  fontSize={{ base: "16px", sm: "22px" }}
                >
                  {chain.name}
                </Text>
              </Flex>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TrustedBy;
