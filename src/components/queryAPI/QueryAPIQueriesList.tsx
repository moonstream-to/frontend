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
  const { queries } = useQueryAPI();

  if (queries.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {queries.data?.data && (
        <Flex flexDirection="column" overflowY="auto">
          {queries.data.data.map((query: { entry_id: string; name: string }, idx: number) => (
            <QueryAPIQueriesListItem key={query.entry_id} query={query} idx={idx} />
          ))}
        </Flex>
      )}
    </>
  );
};
export default QueryAPIQueriesList;
