import { Button, Flex, Text } from "@chakra-ui/react";
import LoginButton from "./LoginButton";
import commonStyles from "./common.module.css";

const NeedAuthorizationView = () => {
  return (
    <Flex direction="column" gap="60px" mx="auto" fontSize="18px" maxW="600px">
      <Flex direction="column" gap="40px">
        <Text textAlign="center" fontSize="50px" lineHeight="50px" fontWeight="700">
          Everything you need for on-chain game design
        </Text>
        <Text textAlign="center">
          Access infrastructure tools and systems to build a healthy web3 game economy.{" "}
        </Text>
      </Flex>
      <Flex gap="20px" justifyContent={"center"}>
        <LoginButton>
          <button className={commonStyles.ctaButton}>Log in</button>
        </LoginButton>
        <button className={commonStyles.secondaryButton}>Learn more about our features</button>
      </Flex>
    </Flex>
  );
};

export default NeedAuthorizationView;
