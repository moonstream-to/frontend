import { useQuery } from "react-query";
import { Flex, Spinner } from "@chakra-ui/react";

import queryCacheProps from "../../hooks/hookCommon";
import { SubscriptionsService } from "../../services";

import Item from "./AnalyticsAddressesListItem";
import useAnalytics from "../../contexts/AnalyticsContext";

const AnalyticsAddressesList = () => {
  const { addresses } = useAnalytics();

  // const getTypes = async () => {
  //   const response = await SubscriptionsService.getTypes();
  //   return response.data;
  // };

  // const types = useQuery(["subscription_types"], getTypes, {
  //   ...queryCacheProps,
  //   onSuccess(data: any) {
  //     console.log(data);
  //     setTypes(data.subscription_types);
  //   },
  // });

  if (addresses.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {addresses.data && (
        <Flex flexDirection="column" overflowY="auto" gap="5px">
          {addresses.data.map((address: any, idx: number) => (
            <Item
              key={address.id}
              idx={idx}
              address={address}
              // types={types.data?.subscription_types ?? undefined}
            />
          ))}
        </Flex>
      )}
    </>
  );
};
export default AnalyticsAddressesList;
