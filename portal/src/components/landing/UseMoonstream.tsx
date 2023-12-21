import { Flex, Image, Spacer, Text } from "@chakra-ui/react";
import styles from "./UseMoonstream.module.css";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const images = ["gamepad-mini.svg", "code-tablet.svg", "community.svg"].map(
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
      <Flex className={styles.card} h={"100%"}>
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
      <Text className={styles.blockTitle}>Use Moonstream if you are</Text>
      <Flex className={styles.cards}>
        <Card
          image={images[0]}
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
          image={images[1]}
          title={"Game designer"}
          description={
            "Direct player engagement and game economy with leaderboards and drops. Test your on-chain game design before and after launch with real-time analytics that support testnets."
          }
        />
      </Flex>
    </Flex>
  );
};

export default UseMoonstream;
