import { useEffect } from "react";

import { useQueryClient } from "react-query";
import { Center, Flex, Text, useMediaQuery } from "@chakra-ui/react";

import useUser from "../../contexts/UserContext";
import AnalyticsAddressesView from "./AnalyticsAddressesView";
import useAnalytics from "../../contexts/AnalyticsContext";
import AnalyticsNewAddressView from "./AnalyticsNewAddressView";
import AnalyticsSmartContractView from "./AnalyticsSmartContractView";
import { HiOutlineRefresh } from "react-icons/hi";

const AnalyticsView = () => {
  const { isCreatingAddress, reset, addresses, selectedAddressId } = useAnalytics();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [isTallScreen] = useMediaQuery("(min-height: 1080px)");

  useEffect(() => {
    if (!user) {
      queryClient.invalidateQueries("");
      reset();
    }
  }, [user]);

  return (
    <Center>
      {user && (
        <Flex
          gap="30px"
          py="30px"
          px={{ base: 0, xl: "5%", "2xl": "10%" }}
          minH={isTallScreen ? "calc(100vh - 320px)" : "760px"}
          minW="90%"
          position="relative"
          alignSelf="stretch"
        >
          <AnalyticsAddressesView />
          <Flex minW="400px" />
          {addresses.data?.length > 0 && !isCreatingAddress && (
            <AnalyticsSmartContractView address={addresses.data[selectedAddressId]} />
          )}
          {(isCreatingAddress || addresses.data?.length === 0) && <AnalyticsNewAddressView />}
          {(addresses.isLoading || addresses.isError) && (
            <Flex
              borderRadius="20px"
              bg="#2d2d2d"
              w="100%"
              minH="100%"
              direction="column"
              overflowY="auto"
              p="30px"
            >
              {addresses.isError && (
                <Flex gap="20px" alignItems="center">
                  <Text color="error.500" fontSize="20px" fontWeight="700">
                    Can&apos;t load addresses: {addresses.error.message}
                  </Text>
                  <HiOutlineRefresh onClick={() => addresses.refetch()} />
                </Flex>
              )}
            </Flex>
          )}
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
