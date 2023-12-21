import { Flex, Image, Link } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";
import styles from "./TrustedBy.module.css";

const featuredBy = [
  {
    name: "TechCrunch",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/tech-crunch-logo.png`,
    w: 103,
    h: 14.65,
    href: "https://www.crypto-reporter.com/press-releases/moonstream-to-wins-techcrunch-pitch-off-earning-a-spot-at-disrupt-2023-39287",
  },
  {
    name: "Cointelegraph",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/cointelegraph-logo.png`,
    w: 103,
    h: 20.81,
    href: "https://cointelegraph.com/news/17-of-addresses-snapped-up-80-of-all-ethereum-nfts-since-april",
  },
  // { name: "in", img: `${AWS_STATIC_ASSETS_PATH}/logos/be-in-crypto.png`, w: 18, h: 19 }, //should be 72
  {
    name: "gam3r",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/gam3r-logo.png`,
    w: 73,
    h: 19,
    href: "https://youtu.be/foVteawyCrU?si=aXVWJVygOGUqooAZ",
  },
  {
    name: "cryptoslate",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/cryptoslate-logo.png`,
    w: 98,
    h: 16,
    href: "https://cryptoslate.com/should-investors-care-80-of-all-nfts-belong-to-17-of-addresses/",
  },
  {
    name: "crypto reporter",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/crypto-reporter-logo.png`,
    w: 97,
    h: 23,
    href: "https://www.crypto-reporter.com/press-releases/moonstream-to-wins-techcrunch-pitch-off-earning-a-spot-at-disrupt-2023-39287",
  },
  {
    name: "educative",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/educative-logo.png`,
    w: 85,
    h: 18,
    href: "https://youtu.be/Z1ujaZ4qcDQ?si=hpTZMfXGZfpw9CnA",
  },
  {
    name: "crypto insiders",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/crypto-insiders-logo.png`,
    w: 94,
    h: 16,
    href: "https://www.crypto-insiders.nl/nieuws/altcoin/17-van-ethereum-whales-bezitten-meer-dan-80-van-alle-nfts-op-de-blockchain/",
  },
];

const LandingFeaturedBy2 = ({ ...props }) => {
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
      px={"150px"}
      mb={{ base: "40px", sm: "80px" }}
    >
      {featuredBy
        .concat(featuredBy)
        .concat(featuredBy)
        .map((f, idx) => (
          <Link href={f.href} key={idx} target="_blank" flexShrink={0}>
            <Image src={f.img} alt={f.name} h={`${f.h}px`} w={`${f.w}px`} />
          </Link>
        ))}
    </Flex>
  );
};

export default LandingFeaturedBy2;
