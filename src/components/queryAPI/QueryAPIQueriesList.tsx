import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import useQueryAPI from "../../contexts/QueryAPIContext";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import http from "../../utils/httpMoonstream";
import QueryAPIQueriesListItem from "./QueryAPIQueriesListItem";

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
    onSuccess: (data: any) => {
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
          {queries.data.data.map((query: any) => (
            <QueryAPIQueriesListItem key={query.entry_id} query={query} />
          ))}
        </Flex>
      )}
    </>
  );
};
export default QueryAPIQueriesList;
