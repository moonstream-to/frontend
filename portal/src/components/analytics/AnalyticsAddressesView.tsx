import { useState } from "react";

import { Button, Flex, Input, InputGroup, InputRightElement, Spacer, Text } from "@chakra-ui/react";

import NewQueryRequest from "../NewQueryRequest";
import useAnalytics from "../../contexts/AnalyticsContext";
import { SearchIcon } from "@chakra-ui/icons";
import AnalyticsAddressesList from "./AnalyticsAddressesList";
import AddressesPlaceholder from "./AddressesPlaceholder";
// import QueryAPIQueriesList from "./QueryAPIQueriesList";
// import QueryContractsList from "./QueryContractsList";

const AnalyticsAddressesView = () => {
  const {
    isShowContracts,
    setIsShowContracts,
    filter,
    setFilter,
    setIsCreatingContract,
    isCreatingContract,
    addresses,
  } = useAnalytics();

  const [isQueryRequestOpen, setIsQueryRequestOpen] = useState(false);
  return (
    <Flex
      // minW="450px"
      maxW="400px"
      borderRadius="20px"
      p="30px"
      bg="#2d2d2d"
      gap="30px"
      flexDirection="column"
      opacity={isCreatingContract ? 0.4 : 1}
    >
      <Text variant="title">Addresses</Text>
      {addresses.data?.length > 100 && (
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
      {addresses.data?.length !== 0 && <AddressesPlaceholder />}
      {/* {isShowContracts && <QueryContractsList />}
      {!isShowContracts && <QueryAPIQueriesList />} */}
      <Spacer />
      <Button
        width="100%"
        bg="gray.0"
        fontWeight="700"
        fontSize="20px"
        color="#2d2d2d"
        onClick={() => {
          setIsCreatingContract(true);
        }}
        disabled={isCreatingContract}
      >
        + Watch new address
      </Button>
    </Flex>
  );
};

export default AnalyticsAddressesView;
