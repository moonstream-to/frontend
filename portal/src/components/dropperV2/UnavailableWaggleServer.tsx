import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import RadioButtonNotSelected from "../icons/RadioButtonNotSelected";
import styles from "./SigningAccountView.module.css";

const UnavailableWaggleServer = ({ subdomain }: { subdomain: string }) => {
  return (
    <Flex
      fontSize={"12px"}
      color={"#848484"}
      alignItems={"center"}
      lineHeight={"100%"}
      justifyContent={"space-between"}
    >
      <Flex w={"156px"} gap={"10px"} alignItems={"center"}>
        <RadioButtonNotSelected color={"#4d4d4d"} />
        <Text>data is unavailable</Text>
      </Flex>
      <Text w={"118px"} color={"white"}>
        {subdomain}
      </Text>
      <Text w={"80px"} className={styles.statusUnavailable}>
        Unavailable
      </Text>
      <Text w={"241px"}>data is unavailable</Text>
    </Flex>
  );
};

export default UnavailableWaggleServer;
