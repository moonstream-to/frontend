import { Flex, Image, Link } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";
import styles from "./TrustedBy.module.css";
import Marquee from "react-fast-marquee";

const assetsPath = `${AWS_STATIC_ASSETS_PATH}/landing/logos`;
const assets = {
  championsAscension: `${assetsPath}/champions-ascension.png`,
  cryptoGuilds: `${assetsPath}/Logo-CG-white.png`,
  cryptoUnicorns: `${assetsPath}/crypto-unicorns-logo.png`,
  metaboy: `${assetsPath}/Metaboy-logo.png`,
  game7io: `${assetsPath}/GAME7-LOGO-white.png`,
  opGames: `${assetsPath}/op-games-logo.png`,
  orangedao: `${assetsPath}/orange-dao-logo.png`,
  worlds: `${assetsPath}/worlds-logo-white.png`,
  caldera: `${assetsPath}/caldera-logo.png`,
  etherium: `${assetsPath}/eth-logo.png`,
  gnosis: `${assetsPath}/gnosis-logo.png`,
  polygon: `${assetsPath}/polygon-logo.png`,
  mumbai: `${assetsPath}/polygon-logo.png`,
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

const TrustedBy2 = ({ ...props }) => {
  return (
    <div className={styles.container}>
      <Marquee pauseOnHover={true} className={styles.carousel} style={{ overflow: "auto" }}>
        {trustedBy.concat(trustedBy).map((f, idx) => (
          <Link href={f.href} key={idx} target="_blank" flexShrink={0}>
            <Flex mx={"20px"}>
              <Image src={f.img} alt={f.name} h={{ base: f.h.base, sm: f.h.sm }} />
            </Flex>
          </Link>
        ))}
      </Marquee>
    </div>
  );
};

export default TrustedBy2;
