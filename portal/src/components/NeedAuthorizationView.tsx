import { Button, Flex, Text } from "@chakra-ui/react";
import LoginButton from "./LoginButton";

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
      <Flex gap="20px">
        <LoginButton>
          <Button variant="orangeGradient">Log in</Button>
        </LoginButton>
        <Button variant="whiteOutline">Learn more about our features</Button>
      </Flex>
    </Flex>
  );
};

export default NeedAuthorizationView;
