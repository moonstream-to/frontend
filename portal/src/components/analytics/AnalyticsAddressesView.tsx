import { Button, Flex, Input, InputGroup, InputRightElement, Spacer, Text } from "@chakra-ui/react";

import useAnalytics from "../../contexts/AnalyticsContext";
import { SearchIcon } from "@chakra-ui/icons";
import AnalyticsAddressesList from "./AnalyticsAddressesList";
import AddressesPlaceholder from "./AddressesPlaceholder";
import { SkeletonComponent } from "./AnalyticsListItemSkeleton";

const AnalyticsAddressesView = () => {
  const { filter, setFilter, setIsCreatingAddress, isCreatingAddress, addresses } = useAnalytics();

  return (
    <Flex
      minW="400px"
      maxW="400px"
      borderRadius="20px"
      p="30px"
      bg="#2d2d2d"
      gap="30px"
      flexDirection="column"
      opacity={isCreatingAddress ? 0.4 : 1}
      position="absolute"
      top="30"
      bottom="30"
    >
      <Text variant="title">Addresses</Text>
      {addresses.data?.length > 0 && (
        <>
          <InputGroup>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={"Search by address or tag"}
              borderRadius="10px"
              p="8px 15px"
            />
            <InputRightElement>
              <SearchIcon />
            </InputRightElement>
          </InputGroup>
          <AnalyticsAddressesList />
        </>
      )}
      {addresses.data?.length === 0 && !addresses.isLoading && <AddressesPlaceholder />}
      {addresses.isLoading && [1, 2, 3, 4, 5].map((_, idx) => <SkeletonComponent key={idx} />)}
      <Spacer />
      <Button
        width="100%"
        bg="gray.0"
        fontWeight="700"
        fontSize="20px"
        color="#2d2d2d"
        onClick={() => {
          setIsCreatingAddress(true);
        }}
        disabled={isCreatingAddress}
      >
        + Watch new address
      </Button>
    </Flex>
  );
};

export default AnalyticsAddressesView;
