import React from "react";
import { Flex, Image, Link, Text } from "@chakra-ui/react";
import Marquee from "react-fast-marquee";

import { AWS_STATIC_ASSETS_PATH } from "../../constants";
import styles from "./LandingFeaturedBy.module.css";

const featuredBy = [
  {
    name: "TechCrunch",
    img: `${AWS_STATIC_ASSETS_PATH}/logos/tech-crunch-logo.png`,
    w: 103,
    h: 14.65,
    href: "https://youtu.be/t16AqaWwBro?si=U8OCnFLgwQvE8UQ1",
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
    <Flex className={styles.container}>
      <Text fontSize={{ base: "30px", sm: "40px" }} fontWeight={"700"}>
        Featured by
      </Text>
      <Marquee pauseOnHover={true} className={styles.carousel} style={{ overflow: "auto" }}>
        {featuredBy.concat(featuredBy).map((f, idx) => (
          <Link href={f.href} key={idx} target="_blank" flexShrink={0}>
            <Image
              src={f.img}
              alt={f.name}
              h={{ base: `${f.h}px`, sm: `${f.h * 1.8}px`, md: `${f.h * 2.0}px` }}
              w={{ base: `${f.w}px`, sm: `${f.w * 1.8}px`, md: `${f.w * 2.0}px` }}
              mx={{ base: "10px", sm: "25px" }}
              className={styles.image}
            />
          </Link>
        ))}
      </Marquee>
    </Flex>
  );
};

export default LandingFeaturedBy2;
