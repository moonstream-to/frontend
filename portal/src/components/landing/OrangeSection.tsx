import React from "react";
import { Flex, Link, Text } from "@chakra-ui/react";

import styles from "../common.module.css";

const lightOrangeColor = "#F56646";

const OrangeSection = () => {
  return (
    <Flex
      py={"20px"}
      px={{ base: "7%", xl: "101px" }}
      gap={{ base: "40px", sm: "60px" }}
      direction="column"
      alignItems="center"
      bgColor="#F56646"
      w={"100%"}
      borderTop={"2px solid white"}
      borderBottom={"1px solid white"}
    >
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        direction={["column", "column", "row"]}
        borderWidth="2px"
        borderColor={lightOrangeColor}
        textColor="white"
        maxW={"1238px"}
        gap={"20px"}
      >
        <Text
          display="block"
          fontSize={{ base: "16px", sm: "18px" }}
          textAlign={["center", "center", "left"]}
          letterSpacing="tight"
          maxW={"630px"}
          fontWeight={"500"}
          fontFamily={"Inter"}
        >
          {`Get technical support, showcase your web3 game, discuss web3 projects and gaming, meme and chat.`}
        </Text>

        <Link isExternal href="https://discord.gg/K56VNUQGvA">
          <button className={styles.secondaryButton}>Join our Discord</button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default OrangeSection;
