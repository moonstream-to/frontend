import { useState } from "react";

import { Button, Flex, Input, Spacer } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";

import NewQueryRequest from "../NewQueryRequest";
import QueryAPIQueriesList from "./QueryAPIQueriesList";
import QueryContractsList from "./QueryContractsList";

const QueryListView = () => {
  const {
    isShowContracts,
    setIsShowContracts,
    filter,
    setFilter,
    setIsCreatingContract,
    isCreatingContract,
  } = useQueryAPI();

  const [isQueryRequestOpen, setIsQueryRequestOpen] = useState(false);
  return (
    <Flex minW="400px" borderRadius="20px" p="30px" bg="#2d2d2d" gap="30px" flexDirection="column">
      <Flex gap="20px" justifyContent="start" fontSize="24px" lineHeight="24px" p="0">
        <Button
          variant="selector"
          disabled={!isShowContracts}
          onClick={() => setIsShowContracts(false)}
        >
          Queries
        </Button>
        <Button
          variant="selector"
          disabled={isShowContracts}
          onClick={() => setIsShowContracts(true)}
        >
          Contracts
        </Button>
      </Flex>
      <Input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={isShowContracts ? "Enter contract or tag name" : "Enter query name"}
        borderRadius="10px"
        p="8px 15px"
      />
      {isShowContracts && <QueryContractsList />}
      {!isShowContracts && <QueryAPIQueriesList />}
      <Spacer />
      <Button
        width="100%"
        bg="gray.0"
        fontWeight="700"
        fontSize="20px"
        color="#2d2d2d"
        onClick={() => {
          if (isShowContracts) {
            setIsCreatingContract(true);
          } else {
            setIsQueryRequestOpen(true);
          }
        }}
        disabled={isCreatingContract}
      >
        {isShowContracts ? "+ Add new" : "Request new query"}
      </Button>
      <NewQueryRequest isOpen={isQueryRequestOpen} onClose={() => setIsQueryRequestOpen(false)} />
    </Flex>
  );
};

export default QueryListView;
