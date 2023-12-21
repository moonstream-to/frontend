import { Flex, Image, Link } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";
import styles from "./TrustedBy.module.css";

const assetsPath = `${AWS_STATIC_ASSETS_PATH}/landing/logos`;
const assets = {
  championsAscension: `${AWS_STATIC_ASSETS_PATH}/landing/logos/champions-ascension.png`,
  cryptoGuilds: `${AWS_STATIC_ASSETS_PATH}/landing/logos/Logo-CG-white.png`,
  cryptoUnicorns: `${AWS_STATIC_ASSETS_PATH}/landing/logos/crypto-unicorns-logo.png`,
  metaboy: `${AWS_STATIC_ASSETS_PATH}/landing/logos/Metaboy-logo.png`,
  game7io: `${AWS_STATIC_ASSETS_PATH}/landing/logos/GAME7-LOGO-white.png`,
  opGames: `${AWS_STATIC_ASSETS_PATH}/landing/logos/op-games-logo.png`,
  orangedao: `${AWS_STATIC_ASSETS_PATH}/landing/logos/orange-dao-logo.png`,
  worlds: `${AWS_STATIC_ASSETS_PATH}/landing/logos/worlds-logo-white.png`,
  caldera: `${AWS_STATIC_ASSETS_PATH}/landing/logos/caldera-logo.png`,
  etherium: `${AWS_STATIC_ASSETS_PATH}/landing/logos/eth-logo.png`,
  gnosis: `${AWS_STATIC_ASSETS_PATH}/landing/logos/gnosis-logo.png`,
  polygon: `${AWS_STATIC_ASSETS_PATH}/landing/logos/polygon-logo.png`,
  mumbai: `${AWS_STATIC_ASSETS_PATH}/landing/logos/polygon-logo.png`,
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
    w: { base: "20px", sm: "36px" },
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

const TrustedBy2 = ({ ...props }) => {
  return (
    <Flex
      gap={{ base: "20px", sm: "50px" }}
      overflowX="auto"
      maxW="100%"
      position="relative"
      py={"10px"}
      className={styles.carousel}
      bg={"#101114"}
      alignItems={"center"}
    >
      {trustedBy
        .concat(trustedBy)
        .concat(trustedBy)
        .map((f, idx) => (
          <Link href={f.href} key={idx} target="_blank" flexShrink={0}>
            <Image src={f.img} alt={f.name} h={{ base: f.h.base, sm: f.h.sm }} />
          </Link>
        ))}
    </Flex>
  );
};

export default TrustedBy2;
