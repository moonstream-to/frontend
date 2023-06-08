import { useEffect } from "react";

import { useQueryClient } from "react-query";
import { Center, Flex, Text } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";
import useUser from "../../contexts/UserContext";
import AnalyticsAddressesView from "./AnalyticsAddressesView";
import useAnalytics from "../../contexts/AnalyticsContext";

// import QueryAPINewContractView from "./QueryAPINewContractView";
// import QueryAPIQueryView from "./QueryAPIQueryView";
// import QueryContractView from "./QueryContractView";
// import QueryListView from "./QueryListView";

const AnalyticsView = () => {
  const { isCreatingContract, isShowContracts, reset, addresses, selectedContractId } =
    useAnalytics();
  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      queryClient.invalidateQueries("");
      reset();
    }
  }, [user]);

  return (
    <Center>
      {user && (
        <Flex gap="30px" py="30px" px="7%" maxH="760px" minH="760px" maxW="1600px" minW="1400px">
          <AnalyticsAddressesView />
          {/* {isShowContracts && contracts.data && !isCreatingContract && (
            <QueryContractView contract={contracts.data[selectedContractId]} />
          )}
          {isCreatingContract && <QueryAPINewContractView />}
          {!isShowContracts && <QueryAPIQueryView />} */}
        </Flex>
      )}
      {!user && (
        <Text mt="80px" fontSize="20px" fontWeight="700">
          You should log in to use this page
        </Text>
      )}
    </Center>
  );
};

export default AnalyticsView;
