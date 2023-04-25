import { Center, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import useQueryAPI from "../../contexts/QueryAPIContext";
import useUser from "../../contexts/UserContext";
import QueryAPINewContractView from "./QueryAPINewContractView";
import QueryAPIQueryView from "./QueryAPIQueryView";
import QueryContractView from "./QueryContractView";
import QueryListView from "./QueryListView";

const QueryAPIView = () => {
  const { isCreatingContract, isShowContracts, reset } = useQueryAPI();
  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries("");
    reset();
  }, [user]);

  return (
    <Center>
      {user && (
        <Flex gap="30px" py="30px" px="7%" maxH="760px" minH="760px" maxW="1600px" minW="1400px">
          <QueryListView />
          {isShowContracts &&
            (!isCreatingContract ? <QueryContractView /> : <QueryAPINewContractView />)}
          {!isShowContracts && <QueryAPIQueryView />}
        </Flex>
      )}
      {!user && <Text mt="80px">You should log in to use this page</Text>}
    </Center>
  );
};

export default QueryAPIView;
