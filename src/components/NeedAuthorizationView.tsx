import { Button, Flex, Text } from "@chakra-ui/react";
import LoginButton from "./LoginButton";

const NeedAuthorizationView = () => {
  return (
    <Flex direction="column" gap="10px" mx="auto" mt="60px">
      <Text textAlign="center">Authorization Required</Text>
      <Text>
        Please&nbsp;
        <LoginButton>
          <Button
            verticalAlign="center"
            variant="transparent"
            p="0"
            h="auto"
            fontWeight="400"
            color="#F88F78"
          >
            log in
          </Button>
        </LoginButton>
        &nbsp;to view this page.
      </Text>
    </Flex>
  );
};

export default NeedAuthorizationView;
