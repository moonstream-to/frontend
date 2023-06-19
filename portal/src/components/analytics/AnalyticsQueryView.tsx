import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import queryCacheProps from "../../hooks/hookCommon";
import { getRandomParameters } from "../../mocks";
import AnalyticsQueryParameters from "./AnalyticsQueryParameters";
import { QueryInterface } from "./AnalyticsSmartContractQueries";
import { isValidArray } from "./validateParameters";

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
      const newParams = queryData.data.parameters.map((key) => {
        let value = "";
        if (key === "end_timestamp") {
          value = String(Math.floor(Date.now() / 1000));
        } else {
          if (key === "start_timestamp") {
            const date = new Date(Date.now());
            let newMonth = date.getUTCMonth() - 1;
            if (newMonth === -1) {
              newMonth = 11;
            }
            date.setMonth(newMonth);
            value = String(Math.floor(date.getTime() / 1000));
          }
        }
        return { key, value };
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
          variant="runButton"
          color="#4d4d4d"
          borderRadius="30px"
          p="6px 20px"
          fontSize="14px"
          h="30px"
          disabled={!isValidArray(params)}
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
