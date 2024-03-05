import { Flex, Image, Link, Text, useMediaQuery } from "@chakra-ui/react";
import styles from "./Hero.module.css";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const image320 = `${AWS_STATIC_ASSETS_PATH}/landing/leaderboard-magic-2-320.png`;
const image768 = `${AWS_STATIC_ASSETS_PATH}/landing/leaderboard-magic-2-768.png`;
const image1440 = `${AWS_STATIC_ASSETS_PATH}/landing/leaderboard-magic-2-1440.png`;

const Hero = () => {
  const [is768view, is1440View] = useMediaQuery(["(min-width: 768px)", "(min-width: 1440px)"]);

  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <Flex className={styles.container} w={"100%"} maxW={"1440px"}>
        <Flex className={styles.content} w={"100%"}>
          <Text className={styles.title}>
            LiveOps for <br /> your web3 game
          </Text>
          <Text className={styles.text}>
            Tune your game, run leaderboards for on-chain and off-chain activity, analyze player
            behavior, catch and fix exploits, distribute rewards, and more.
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
          src={is1440View ? image1440 : is768view ? image768 : image320}
        />
      </Flex>
    </Flex>
  );
};

export default Hero;
