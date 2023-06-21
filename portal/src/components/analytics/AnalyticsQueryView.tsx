import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { getRandomParameters } from "../../mocks";
import http from "../../utils/httpMoonstream";
import AnalyticsQueryParameters from "./AnalyticsQueryParameters";
import AnalyticsQueryResults from "./AnalyticsQueryResults";
import { QueryInterface } from "./AnalyticsSmartContractQueries";
import { isValidArray } from "./validateParameters";
import QueryAPIResult from "../queryAPI/QueryAPIResult";
import { RxReload } from "react-icons/rx";

const AnalyticsQueryView = ({ query }: { query: QueryInterface }) => {
  const [params, setParams] = useState<{ key: string; value: string }[]>([]);
  const [result, setResult] = useState("");
  const [queryStatus, setQueryStatus] = useState("");
  const [filename, setFilename] = useState("");
  const runQueryRef = useRef(false);
  const toast = useMoonToast();

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getQuery = () => {
    return http({
      method: "GET",
      url: `${API}/queries/${query.context_url}/query`,
    }).then((res) => {
      const parameters = { ...res.data.parameters };
      delete parameters.address; //Using address from subscription, not from input
      const data = { ...res.data, parameters };
      return data;
    });
  };

  const getMockQuery = () => {
    return new Promise((_, resolve) => {
      setTimeout(() => {
        resolve({
          data: { parameters: ["start_timestamp", "end_timestamp", ...getRandomParameters()] },
        });
      }, Math.floor(Math.random() * 5000));
    });
  };

  const queryData = useQuery(["queryData", query.context_url], getQuery, {
    ...queryCacheProps,
    onError: (error: Error) => {
      console.log(error);
    },
    enabled: !!query.context_url,
  });

  useEffect(() => {
    if (queryData.data?.parameters) {
      const newParams = Object.keys(queryData.data.parameters).map((key) => {
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
      setParams(newParams);
    }
  }, [queryData.data]);

  const handleRun = async () => {
    setResult("");
    setQueryStatus("executing...");
    runQueryRef.current = true;

    const paramsObj: any = {};
    params.forEach((param) => (paramsObj[param.key] = param.value));
    const requestTimestamp = new Date().toUTCString();
    const presignedUrl = await http({
      method: "POST",
      url: `${API}/queries/${query.context_url}/update_data`,
      data: {
        blockchain: "polygon",
        params: { ...paramsObj, address: "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f" },
      },
    })
      .then(async (res: any) => {
        return res.data;
      })
      .catch((e: Error) => {
        toast(e.message, "error");
      });

    if (presignedUrl?.url) {
      setQueryStatus("uploading...");
      try {
        const res = await getFromPresignedURL(presignedUrl.url, requestTimestamp);
        setResult(JSON.stringify(res, null, "\t"));
        setQueryStatus("");
        setFilename(`${query.context_url}_${requestTimestamp}.json`);
      } catch (e: any) {
        setQueryStatus(e.message);
      }
    } else {
      setQueryStatus("error");
    }
    runQueryRef.current = false;
    setTimeout(() => {
      setQueryStatus("");
    }, 2000);
  };

  interface RequestParameters {
    url?: string;
    headers?: any;
    method?: string;
    mode?: string;
  }

  const getFromPresignedURL = async (url: string, requestTimestamp: string) => {
    const requestParameters: RequestParameters = {
      url: url,
      headers: {
        "If-Modified-Since": requestTimestamp,
      },
      method: "GET",
    };
    while (runQueryRef.current) {
      try {
        const response = await axios(requestParameters);
        return response; //TODO handle not 404 || 304 errors
      } catch (e) {
        console.log(e);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
    return new Promise((_, reject) => reject(new Error("interrupted by user")));
  };

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
        <Text variant="title3">{query.title.split("-").join(" ")}</Text>
        <RxReload onClick={() => queryData.refetch()} />
        <Button
          variant="runButton"
          color="#4d4d4d"
          borderRadius="30px"
          p="6px 20px"
          fontSize="14px"
          h="30px"
          disabled={!isValidArray(params)}
          onClick={handleRun}
        >
          Run
        </Button>
      </Flex>
      <Text>{query.description}</Text>
      {params.length > 0 && <AnalyticsQueryParameters params={params} setParam={setParam} />}
      {result === "" && queryStatus === "" && <AnalyticsQueryResults result={result} />}
      {(queryStatus || result) && (
        <QueryAPIResult
          result={result}
          status={queryStatus}
          filename={filename}
          onCancel={() => {
            setQueryStatus("canceling...");
            runQueryRef.current = false;
          }}
        />
      )}
    </Flex>
  );
};

export default AnalyticsQueryView;
