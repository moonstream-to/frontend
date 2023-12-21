import styles from "./SupportedChains.module.css";
import { Flex, Image, Text } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";
import UpcomingIntegrations from "./UpcomingIntegrations";

const SupportedChains = () => {
  const chains = [
    "caldera.png",
    "ethereum.png",
    "gnosis-new.png",
    "polygon-new.png",
    "mumbai.png",
    "era.png",
    "era-testnet.png",
  ];
  return (
    <Flex className={styles.container}>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "4px", sm: "15px" }}
        alignItems={"center"}
      >
        <Text className={styles.title}>Supported chains</Text>
        <Text className={styles.title}>+</Text>
        <Flex className={styles.testnetFlex} w={"fit-content"}>
          <Text className={styles.testnet}>testnets</Text>
        </Flex>
      </Flex>
      <Flex className={styles.chains}>
        {chains.map((img, idx) => (
          <Image
            key={idx}
            alt={""}
            h={{ base: "27px", sm: "40px" }}
            src={`${AWS_STATIC_ASSETS_PATH}/landing/logos/${img}`}
          />
        ))}
      </Flex>
      <UpcomingIntegrations />
    </Flex>
  );
};

export default SupportedChains;
