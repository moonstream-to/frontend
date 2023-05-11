import { Flex, Text } from "@chakra-ui/react";

import { AiOutlinePlusCircle } from "react-icons/ai";

import TokensList from "./TokensList";

const TokensView = () => {
  return (
    <Flex px="7%" py="30px" w="100%">
      <Flex
        direction="column"
        p="30px"
        gap="20px"
        borderRadius="20px"
        bg="#2d2d2d"
        minH="100%"
        minW="860px"
        position="relative"
        mx="auto"
      >
        <Flex justifyContent="space-between" w="100%" alignItems="center">
          <Text fontSize="24px" fontWeight="700">
            My API tokens
          </Text>
          <AiOutlinePlusCircle cursor="pointer" size="24" />
        </Flex>

        <TokensList />
      </Flex>
    </Flex>
  );
};

export default TokensView;
