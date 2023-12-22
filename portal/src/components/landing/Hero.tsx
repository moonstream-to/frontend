import styles from "./Hero.module.css";
import { Flex, Image, Link, Text, useMediaQuery } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const Hero = () => {
  const [is768view] = useMediaQuery(["(min-width: 768px) and (max-width: 1023px)"]);
  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <Flex className={styles.container} w={"100%"} maxW={"1440px"}>
        <Flex className={styles.content} w={"100%"}>
          <Text className={styles.title}>
            Leaderboards for
            <br /> your web3 game
          </Text>
          <Text className={styles.text}>
            Automate rewarding players for their on-chain and off-chain activity.
          </Text>
          <Link
            isExternal
            href={"https://calendly.com/d/5dr-xh2-xq6/moonstream-demo "}
            _hover={{ textDecoration: "none" }}
          >
            <button className={styles.button}>Request Demo</button>
          </Link>
        </Flex>
        <Image
          alt={""}
          className={styles.image}
          src={
            is768view
              ? `${AWS_STATIC_ASSETS_PATH}/landing/hero-image-v.png`
              : `${AWS_STATIC_ASSETS_PATH}/landing/hero-image-h.png`
          }
        />
      </Flex>
    </Flex>
  );
};

export default Hero;
