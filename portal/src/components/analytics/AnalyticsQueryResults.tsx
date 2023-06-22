import { Flex, Text } from "@chakra-ui/layout";
import { BsCalculator } from "react-icons/bs";

const AnalyticsQueryResults = () => {
  return (
    <Flex direction="column" gap="15px" alignItems="center">
      <Text variant="title3" placeSelf="start">
        Results
      </Text>
      <Flex
        direction="column"
        gap="15px"
        p="20px"
        bg="#232323"
        border="1px solid #4d4d4d"
        borderRadius="10px"
        alignItems="center"
        w="100%"
      >
        <BsCalculator width="20px" height="20px" color="white" />
        <Text variant="text" w="377px" textAlign="center">
          Configure your dataset settings above and click run. The results will show up here.
        </Text>
      </Flex>
    </Flex>
  );
};

export default AnalyticsQueryResults;
