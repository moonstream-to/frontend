import { Button, Flex, Text } from "@chakra-ui/react";

const QueryAPIResult = ({ result }: { result: string }) => {
  return (
    <Flex direction="column" gap="20px" bg="#232323" border="1px solid #4d4d4d" borderRadius="10px">
      <Flex justifyContent="space-between" alignItems="center" fontSize="16px">
        <Text fontWeight="700">JSON</Text>
        <Button variant="transparent">
          <Text fontWeight="400">Download</Text>
        </Button>
      </Flex>
      <Text
        fontSize="14px"
        bg="#2d2d2d"
        border="1px solid #353535"
        borderRadius="5px"
        overflow="auto"
      >
        {result}
      </Text>
    </Flex>
  );
};

export default QueryAPIResult;
