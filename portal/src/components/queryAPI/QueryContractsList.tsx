import { useQuery } from "react-query";
import { Flex, Spinner } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";
import queryCacheProps from "../../hooks/hookCommon";
import { SubscriptionsService } from "../../services";

import QueryContractsListItem from "./QueryContractsListItem";

const QueryContractsList = () => {
  const { setTypes, contracts } = useQueryAPI();

  const getTypes = async () => {
    const response = await SubscriptionsService.getTypes();
    return response.data;
  };

  const types = useQuery(["subscription_types"], getTypes, {
    ...queryCacheProps,
    onSuccess(data: any) {
      setTypes(data.subscription_types);
    },
  });

  if (contracts.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {contracts.data && (
        <Flex flexDirection="column" overflowY="auto">
          {contracts.data.map((contract: any, idx: number) => (
            <QueryContractsListItem
              key={contract.id}
              idx={idx}
              contract={contract}
              types={types.data?.subscription_types ?? undefined}
            />
          ))}
        </Flex>
      )}
    </>
  );
};
export default QueryContractsList;
