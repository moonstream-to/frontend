import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { useQuery } from "react-query";
import axios from "axios";
import { Button, Flex, Spinner, Text, Input, Box } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";
import Web3Context from "../../contexts/Web3Context/context";
import queryCacheProps from "../../hooks/hookCommon";
import http from "../../utils/httpMoonstream";
import useMoonToast from "../../hooks/useMoonToast";

import Tag from "../Tag";
import QueryAPIResult from "./QueryAPIResult";
import TimestampInput from "../TimestampInput";

const inputs = [
  "address",
  "event_name",
  "start_timestamp",
  "end_timestamp",
  "user_address",
  "start_block_number",
  "end_block_number",
  "blocks_back",
];

const isPositiveInteger = (value: string) => {
  const num = Number(value);
  if (!num && num != 0) {
    return false;
  }
  return num === Math.round(num) && num > -1;
};

const values = ["0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f", "Transfer"];

const QueryAPIQueryView = () => {
  const { web3 } = useContext(Web3Context);

  const isValid = (key: string, value: string, allowEmpty = true) => {
    if (!allowEmpty && value === "") return false;
    const validators = [
      web3.utils.isAddress,
      () => true,
      isPositiveInteger,
      isPositiveInteger,
      web3.utils.isAddress,
      isPositiveInteger,
      isPositiveInteger,
      isPositiveInteger,
    ]; //TODO make it map
    const validatorIdx = inputs.indexOf(key);
    if (validatorIdx > -1 && validatorIdx < validators.length) {
      return validators[validatorIdx](value);
    } else {
      return true;
    }
  };

  const toast = useMoonToast();
  const { queries, selectedQueryId } = useQueryAPI();
  const query = useMemo(
    () => (queries.data?.data ? queries.data.data[selectedQueryId] ?? {} : {}),
    [queries.data, selectedQueryId],
  );
  const [params, setParams] = useState<{ key: string; value: string }[]>([]);
  const [result, setResult] = useState("");
  const [queryStatus, setQueryStatus] = useState("");
  const [filename, setFilename] = useState("");

  useEffect(() => {
    setResult("");
    setParams([]);
  }, [selectedQueryId]);

  const setParam = (idx: number, key: string, value: string) => {
    setParams((prev) => {
      const newParams = [...prev];
      const param = newParams[idx];
      newParams[idx][key as keyof typeof param] = value;
      return newParams;
    });
  };

  const runQueryRef = useRef(false);

  const handleRun = async () => {
    const invalidParam = params.find((param) => !isValid(param.key, param.value, false));
    if (invalidParam) {
      toast(`Input for '${invalidParam.key}' is not valid`, "error");
      return;
    }

    setResult("");
    setQueryStatus("executing...");
    runQueryRef.current = true;

    const paramsObj: any = {};
    params.forEach((param) => (paramsObj[param.key] = param.value));

    const requestTimestamp = new Date().toUTCString();
    const presignedUrl = await http({
      method: "POST",
      url: `${API}/queries/${query.name}/update_data`,
      data: {
        params: paramsObj,
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
        setFilename(`${query.name}_${requestTimestamp}.json`);
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
        return response.data; //TODO handle not 404 || 304 errors
      } catch (e) {
        console.log(e);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
    return new Promise((_, reject) => reject(new Error("interrupted by user")));
  };

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getQuery = () =>
    http({
      method: "GET",
      url: `${API}/queries/${query.name}/query`,
    }).then((res) => {
      return res.data;
    });

  const queryData = useQuery(["queryData", query.name], getQuery, {
    ...queryCacheProps,
    onError: (error: Error) => {
      console.log(error);
    },
    enabled: !!query.name,
  });

  useEffect(() => {
    if (queryData.data?.parameters) {
      const newParams = Object.keys(queryData.data.parameters).map((k) => {
        return { key: k, value: "" };
      });
      setParams(newParams);
    }
  }, [queryData.data]);

  return (
    <>
      {!!query && (
        <Flex
          direction="column"
          p="30px"
          gap="20px"
          borderRadius="20px"
          bg="#2d2d2d"
          w="100%"
          minH="100%"
          minW="800px"
          position="relative"
        >
          <Button
            variant="saveButton"
            position="absolute"
            zIndex="2"
            bottom="15px"
            right="15px"
            onClick={() => handleRun()}
            disabled={!!queryStatus && queryStatus !== "done"}
          >
            {!!queryStatus && queryStatus !== "done" ? queryStatus : "Run"}
          </Button>
          <Flex justifyContent="space-between" alignItems="center" mb="10px">
            <Text fontSize="24px" fontWeight="700" userSelect="none">
              {query.name}
            </Text>
          </Flex>
          {queryData.data && <Tag name={queryData.data.approved ? "approved" : "not approved"} />}
          {!queryData.data &&
            (queryData.isLoading ? <Spinner h="20px" w="20px" /> : <Flex minH="20px" />)}
          <Flex direction="column" p="0px" overflowY="auto" gap="20px">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="20px" fontWeight="700" userSelect="none">
                Inputs
              </Text>
            </Flex>
            <Flex gap="0" w="100%">
              <Flex direction="column" gap="10px" fontSize="18px" w="100%">
                {params.map((param, idx) => {
                  return (
                    <Flex key={idx} gap="0px" minW="100%" alignItems="center" pr="1.5px">
                      <Box
                        bg="#232323"
                        borderRadius="10px"
                        border="1px solid #4D4D4D"
                        p="7px 15px"
                        fontSize="16px"
                        minW="20ch"
                      >
                        {param.key}
                      </Box>
                      {param.key?.includes("timestamp") ? (
                        <TimestampInput
                          timestamp={param.value ?? ""}
                          setTimestamp={(newValue: string) =>
                            setParam(idx, "value", String(newValue))
                          }
                        />
                      ) : (
                        <Input
                          flex="2"
                          h="40px"
                          variant="address"
                          border="1px solid #4D4D4D"
                          borderColor={
                            isValid(param.key, param.value) || !param.value
                              ? "#4d4d4d"
                              : "error.500"
                          }
                          value={param.value}
                          onChange={(e) => setParam(idx, "value", e.target.value)}
                          mr="10px"
                        />
                      )}
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
            {(result || queryStatus) && (
              <QueryAPIResult
                result={result}
                filename={filename}
                status={queryStatus}
                onCancel={() => {
                  setQueryStatus("canceling...");
                  runQueryRef.current = false;
                }}
              />
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
}; //TODO break it to smaller parts

export default QueryAPIQueryView;
