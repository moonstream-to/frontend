import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import styles from "./Web3GamesList.module.css";
import { AWS_ASSETS_PATH_CF } from "../../constants";

const Web3GamesList = () => {
  return (
    <Flex className={styles.container}>
      <Text className={styles.title}>Best web3 games list</Text>
      <Flex className={styles.content}>
        <Image src={`${AWS_ASSETS_PATH_CF}/icons/gamepad-2.svg`} alt={""} />
        <Text className={styles.description}>
          Contribute to our awesome list of web3 games or find fun web3 games to play
        </Text>
      </Flex>

      <Flex direction={{ base: "column", sm: "row" }} gap="20px">
        <Link href="https://github.com/moonstream-to/awesome-web3-games/" isExternal>
          <Button variant="whiteOutline">Learn more</Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Web3GamesList;
