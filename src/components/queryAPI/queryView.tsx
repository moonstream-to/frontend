import { Flex } from "@chakra-ui/react";

import QueryContractView from "./QueryContractView";
import QueryListView from "./QueryListView";

const QueryView = () => {
  return (
    <Flex gap="30px" py="30px" px="7%" maxH="700px" maxW="1000px">
      <QueryListView />
      <QueryContractView />
    </Flex>
  );
};

export default QueryView;
