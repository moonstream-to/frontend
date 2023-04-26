import { Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "react-query";

import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import http from "../../utils/httpMoonstream";
import useQueryAPI from "../../contexts/QueryAPIContext";
import QueryAPIQueriesListItem from "./QueryAPIQueriesListItem";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const QueryAPIQueriesList = () => {
  const toast = useMoonToast();
  const { selectedQuery, setSelectedQuery } = useQueryAPI();

  const getQueries = () =>
    http({
      method: "GET",
      url: `${API}/queries/list`,
    });

  const queries = useQuery(["queries"], getQueries, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
    onSuccess: (data: { data: { entry_id: string; name: string }[] }) => {
      if (!selectedQuery.entry_id) {
        setSelectedQuery(data.data[0] ?? {});
      }
    },
  });

  if (queries.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {queries.data?.data && (
        <Flex flexDirection="column" overflowY="auto">
          {queries.data.data.map((query: { entry_id: string; name: string }) => (
            <QueryAPIQueriesListItem key={query.entry_id} query={query} />
          ))}
        </Flex>
      )}
    </>
  );
};
export default QueryAPIQueriesList;
