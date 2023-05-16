import { Flex, Text } from "@chakra-ui/react";
import LoginButton from "./LoginButton";

const NeedAuthorizationView = () => {
  return (
    <Flex direction="column" gap="10px" mx="auto" mt="60px" fontSize="18px">
      <Text textAlign="center">Authorization Required</Text>
      <Flex>
        <Text>Please&nbsp;</Text>
        <LoginButton>
          <Text
            verticalAlign="center"
            variant="transparent"
            p="0"
            h="auto"
            fontWeight="500"
            fontSize="18px"
            color="#F88F78"
          >
            log in
          </Text>
        </LoginButton>
        <Text>&nbsp;to view this page.</Text>
      </Flex>
    </Flex>
  );
};

export default NeedAuthorizationView;
