import styles from "./Hero.module.css";
import { Flex, Image, Text, useMediaQuery } from "@chakra-ui/react";
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
          <button className={styles.button}>Request Demo</button>
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
