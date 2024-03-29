import { Flex, Image, Text } from "@chakra-ui/react";
import styles from "./UseMoonstream.module.css";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const images = ["founder.svg", "gamepad-mini.svg", "code-tablet.svg", "community.svg"].map(
  (filename) => `${AWS_STATIC_ASSETS_PATH}/landing/icons/${filename}`,
);

const UseMoonstream = () => {
  const Card = ({
    image,
    title,
    description,
  }: {
    image: string;
    title: string;
    description: string;
  }) => {
    return (
      <Flex className={styles.card}>
        <Image src={image} alt={""} w={"100px"} h={"100px"} />
        <Flex direction={"column"} gap={"10px"} flex={"1"}>
          <Text className={styles.title}>{title}</Text>
          <Text className={styles.text}>{description}</Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex className={styles.container}>
      <Text className={styles.blockTitle}>Use Moonstream if you are a...</Text>
      <Flex className={styles.cards}>
        <Card
          image={images[0]}
          title={"Founder"}
          description={
            "Get your game to market faster and maintain your game economy’s sustainability."
          }
        />
        <Card
          image={images[1]}
          title={"Game designer"}
          description={
            "Direct player engagement and game economy with leaderboards and drops. Test your on-chain game design before and after launch with real-time analytics that support testnets."
          }
        />
        <Card
          image={images[2]}
          title={"Community manager"}
          description={
            "Offer players more ways to contribute to and improve the game. Create a core reward loop and introduce more competitive elements. Drive player engagement and retention."
          }
        />
        <Card
          image={images[3]}
          title={"Game developer"}
          description={
            "Make LiveOps easy with real-time analytics and infrastructure tools. Put the right systems in place to correct hyperinflation and catch exploits. Add automation to your web3 game development."
          }
        />
      </Flex>
    </Flex>
  );
};

export default UseMoonstream;
