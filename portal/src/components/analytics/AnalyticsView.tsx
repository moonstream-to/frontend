import { useEffect } from "react";

import { useQueryClient } from "react-query";
import { Center, Flex, Text } from "@chakra-ui/react";

import useUser from "../../contexts/UserContext";
import AnalyticsAddressesView from "./AnalyticsAddressesView";
import useAnalytics from "../../contexts/AnalyticsContext";
import AnalyticsNewAddressView from "./AnalyticsNewAddressView";
import AnalyticsSmartContractView from "./AnalyticsSmartContractView";

const AnalyticsView = () => {
  const { isCreatingAddress, reset, addresses, selectedAddressId } = useAnalytics();
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
        <Flex gap="30px" py="30px" px={{ base: 0, xl: "5%", "2xl": "10%" }} minH="760px" minW="90%">
          <AnalyticsAddressesView />
          {addresses.data?.length > 0 && !isCreatingAddress && (
            <AnalyticsSmartContractView address={addresses.data[selectedAddressId]} />
          )}
          {(isCreatingAddress || addresses.data?.length === 0) && <AnalyticsNewAddressView />}
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
