import styles from "./SupportedChains.module.css";
import { Flex, Image } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

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
    </Flex>
  );
};

export default SupportedChains;
