import styles from "./BlackBlocks.module.css";
import { Flex } from "@chakra-ui/react";
import BlackBlock from "./BlackBlock";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

// const blocks = [];

const BlackBlocks = () => {
  return (
    <Flex className={styles.container}>
      <BlackBlock
        title={"Transparent and Open Source"}
        image={`${AWS_STATIC_ASSETS_PATH}/landing/icons/open-source-icon.svg`}
        description={
          "We build our technology in the open. Give us a star on GitHub to save our repo for later use ⭐"
        }
        buttonText={"Visit GitHub"}
        buttonRef={"https://github.com/moonstream-to"}
      />
      <BlackBlock
        title={"Best web3 games list"}
        image={`${AWS_STATIC_ASSETS_PATH}/landing/icons/gamepad-mini.svg`}
        description={"Contribute to our awesome list of web3 games or find fun web3 games to play"}
        buttonText={"Learn more"}
        buttonRef={"https://github.com/moonstream-to"}
      />
    </Flex>
  );
};

export default BlackBlocks;
