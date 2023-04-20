import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import useQueryAPI from "../../contexts/QueryAPIContext";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import http from "../../utils/httpMoonstream";
import QueryAPIQueriesListItem from "./QueryAPIQueriesListItem";
import QueryContractsListItem from "./QueryContractsListItem";

function compare(a: { created_at: string }, b: { created_at: string }) {
  if (a.created_at > b.created_at) {
    return -1;
  }
  if (a.created_at < b.created_at) {
    return 1;
  }
  return 0;
}

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const QueryAPIQueriesList = () => {
  // const { setTypes } = useQueryAPI();
  const toast = useMoonToast();
  // const { selectedContract, setSelectedContract } = useQueryAPI();

  const getQueries = () =>
    http({
      method: "GET",
      url: `${API}/queries/list`,
    });

  // const getSubscriptions = () => {
  //   return SubscriptionsService.getSubscriptions().then((res) =>
  //     res.data.subscriptions.sort(compare),
  //   );
  // };

  // const getQueries = () => {};

  const queries = useQuery(["queries"], getQueries, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
    onSuccess: (data: any) => {
      console.log(data);
    },
  });

  // const getTypes = async () => {
  //   const response = await SubscriptionsService.getTypes();
  //   return response.data;
  // };

  // const types = useQuery(["subscription_types"], getTypes, {
  //   ...queryCacheProps,
  //   onSuccess(data: any) {
  //     setTypes(data.subscription_types);
  //   },
  // });

  return (
    <>
      {queries.data?.data && (
        <Flex flexDirection="column" overflowY="auto">
          {queries.data.data
            // .slice(5, 55)
            .map((query: any) => (
              <QueryAPIQueriesListItem key={query.entry_id} query={query} />
            ))}
        </Flex>
      )}
    </>
  );
};
export default QueryAPIQueriesList;
