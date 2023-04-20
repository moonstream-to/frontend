import { Center, Flex } from "@chakra-ui/react";
import useQueryAPI from "../../contexts/QueryAPIContext";
import QueryAPINewContractView from "./QueryAPINewContractView";
import QueryAPIQueryView from "./QueryAPIQueryView";
import QueryContractView from "./QueryContractView";
import QueryListView from "./QueryListView";

const QueryAPIView = () => {
  const { isCreatingContract, isShowContracts } = useQueryAPI();
  return (
    <Center>
      <Flex gap="30px" py="30px" px="7%" maxH="760px" minH="760px" maxW="1600px" minW="1600px">
        <QueryListView />
        {isShowContracts &&
          (!isCreatingContract ? <QueryContractView /> : <QueryAPINewContractView />)}
        {!isShowContracts && <QueryAPIQueryView />}
      </Flex>
    </Center>
  );
};

export default QueryAPIView;
