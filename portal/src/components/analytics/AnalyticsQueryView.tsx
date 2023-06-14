import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import queryCacheProps from "../../hooks/hookCommon";
import { getRandomParameters } from "../../mocks";
import http from "../../utils/httpMoonstream";
import AnalyticsQueryParameters from "./AnalyticsQueryParameters";
import { QueryInterface } from "./AnalyticsSmartContractQueries";

const AnalyticsQueryView = ({ query }: { query: QueryInterface }) => {
  const [params, setParams] = useState<{ key: string; value: string }[]>([]);

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getQuery = () => {
    // return http({
    //   method: "GET",
    //   url: `${API}/queries/${query.name}/query`,
    // }).then((res) => {
    //   console.log(res.data);
    //   return res.data;
    // });
    return { parameters: ["start_timestamp", "end_timestamp", ...getRandomParameters()] };
  };

  const queryData = useQuery(["queryData", query.name], getQuery, {
    ...queryCacheProps,
    onError: (error: Error) => {
      console.log(error);
    },
    enabled: !!query.name,
  });

  useEffect(() => {
    console.log(queryData.data?.parameters);
    if (queryData.data?.parameters) {
      const newParams = queryData.data.parameters.map((k) => {
        return { key: k, value: "" };
      });
      // const newParams = Object.keys(queryData.data.parameters).map((k) => {
      //   return { key: k, value: "" };
      // });
      setParams(newParams);
    }
  }, [queryData.data]);

  const setParam = (idx: number, key: string, value: string) => {
    setParams((prev) => {
      const newParams = [...prev];
      const param = newParams[idx];
      newParams[idx][key as keyof typeof param] = value;
      return newParams;
    });
  };

  return (
    <Flex direction="column" gap="20px" fontSize="14px">
      <Flex justifyContent="space-between" alignItems="center">
        <Text variant="title3">{query.name}</Text>
        <Button
          bg="#BFBFBF"
          color="#4d4d4d"
          borderRadius="30px"
          p="6px 20px"
          fontSize="14px"
          h="30px"
        >
          Run
        </Button>
      </Flex>
      <Text>{query.description}</Text>
      <AnalyticsQueryParameters params={params} setParam={setParam} />
    </Flex>
  );
};

export default AnalyticsQueryView;
