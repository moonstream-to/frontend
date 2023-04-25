import { Button, Flex, Spinner, Text, Input, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useQueryAPI from "../../contexts/QueryAPIContext";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";

import Tag from "../Tag";

import axios from "axios";
import http from "../../utils/httpMoonstream";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import styles from "./QueryAPIQueryView.module.css";
import QueryAPIResult from "./QueryAPIResult";
import TimestampInput from "../TimestampInput";
import TimestampInput2 from "../TimestampInput2";

// import MyJsonComponent from "../JSONEdit";

// const MyJsonComponent = dynamic(() => import("../JSONEdit2"), { ssr: false });
// MyJsonComponent.

const formatDate = (dateTimeOffsetString: string) => {
  const date = new Date(dateTimeOffsetString);

  return date.toLocaleDateString();
};

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

const values = ["0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f", "Transfer"];

const QueryAPIQueryView = () => {
  const toast = useMoonToast();
  const { selectedQuery: query } = useQueryAPI();
  const [params, setParams] = useState<{ key: string; value: string }[]>([]);
  const [result, setResult] = useState("");
  const [queryStatus, setQueryStatus] = useState("");
  const [filename, setFilename] = useState("");
  const [keepTryingFetchResult, setKeepTryingFetchResult] = useState(false);

  useEffect(() => {
    setResult("");
  }, [query]);

  const addParam = () => {
    setParams((prev) => {
      const newParams = [...prev];
      newParams.push({ key: inputs[prev.length], value: values[prev.length] });
      return newParams;
    });
  };

  const removeParam = (idx: number) => {
    setParams((prev) => {
      const newParams = prev.slice(0, idx).concat(prev.slice(idx + 1));
      return newParams;
    });
  };

  const setParam = (idx: number, key: string, value: string) => {
    setParams((prev) => {
      const newParams = [...prev];
      const param = newParams[idx];
      newParams[idx][key as keyof typeof param] = value;
      return newParams;
    });
  };

  // usePresignedURL

  const handleRun = async () => {
    const paramsObj: any = {};
    setQueryStatus("executing...");
    params.forEach((param) => (paramsObj[param.key] = param.value));
    // console.log(paramsObj);
    // setQueryStatus("");
    const requestTimestamp = new Date().toUTCString();

    const presignedUrl = await http({
      method: "POST",
      url: `${API}/queries/${query.name}/update_data`,
      data: {
        params: paramsObj,
      },
    })
      .then(async (res: any) => {
        // console.log(res);
        // const results = await getFromPresignedURL(res.url);
        // console.log(results);
        return res.data;
      })
      .catch((e) => console.log(e));

    setQueryStatus("uploading...");
    if (presignedUrl?.url) {
      const res = await getFromPresignedURL(presignedUrl.url, requestTimestamp);
      setResult(JSON.stringify(res, null, "\t"));
      setQueryStatus("done");
      setFilename(`${query.name}_${requestTimestamp}.json`);
    } else {
      setQueryStatus("error");
    }
    setTimeout(() => {
      setQueryStatus("");
    }, 3000);
    // console.log(res);
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
    // let keepGoing = true
    while (true) {
      try {
        const response = await axios(requestParameters);
        // console.log(response);
        return response.data;
      } catch (e) {
        console.log(e);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  };

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getQuery = () =>
    http({
      method: "GET",
      url: `${API}/queries/${query.name}/query`,
    }).then((res) => {
      // console.log(res);
      return res.data;
    });

  const queryData = useQuery(["subscriptonABI", query.name], getQuery, {
    ...queryCacheProps,
    onError: (error: Error) => {
      console.log(error);
    },
    onSettled: (data: any) => {
      // console.log(data);
    },
    enabled: !!query.name,
  });

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
          maxW="800px"
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
            {!queryStatus || queryStatus === "done" ? "Run" : <Spinner />}
          </Button>
          <Flex justifyContent="space-between" alignItems="center" mb="10px">
            <Text fontSize="24px" fontWeight="700">
              {query.name}
            </Text>
          </Flex>
          {queryData.data && (
            <Flex direction="column" gap="15px">
              {queryData.data.tags && (
                <Flex gap="10px">
                  {queryData.data.tags.map((tag: string, idx: number) => (
                    <Tag key={idx} name={tag} />
                  ))}
                </Flex>
              )}
            </Flex>
          )}
          {!queryData.data && <Flex minH="20px" />}
          <Flex direction="column" p="0px" overflowY="auto" gap="20px">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="20px" fontWeight="700" userSelect="none">
                Inputs
              </Text>
              <AiOutlinePlusCircle size="24" onClick={() => addParam()} />
            </Flex>
            <Flex gap="0" w="100%">
              <Flex direction="column" gap="10px" fontSize="18px" w="100%">
                {params.map((param, idx) => {
                  return (
                    <Flex key={idx} gap="0px" minW="100%" alignItems="center" pr="1.5px">
                      <input
                        list="inputs"
                        type="text"
                        value={param.key}
                        onChange={(e) => setParam(idx, "key", e.target.value)}
                        onFocus={() => setParam(idx, "key", "")}
                        className={styles.input}
                        style={{
                          backgroundColor: "#232323",
                          borderRadius: "10px",
                          border: "1px solid #4D4D4D",
                          padding: "7px 15px",
                          fontSize: "16px",
                        }}
                      />
                      <datalist id="inputs">
                        {inputs.map((paramKey) => (
                          <option key={paramKey} value={paramKey}>
                            {paramKey}
                          </option>
                        ))}
                      </datalist>
                      {/* <Select
                      value={param.key}
                      w="fit-content"
                      bg="#232323"
                      onChange={(e) => setParam(idx, "key", e.target.value)}
                      borderColor="#4D4D4D"
                    >
                      {inputs.map((paramKey) => (
                        <option key="paramKey" value={paramKey}>
                          {paramKey}
                        </option>
                      ))}
                    </Select> */}
                      {param.key?.includes("timestamp") ? (
                        // <>
                        <TimestampInput2
                          timestamp={param.value ?? ""}
                          setTimestamp={(newValue: string) =>
                            setParam(idx, "value", String(newValue))
                          }
                        />
                      ) : (
                        //   <Spacer />
                        // </>
                        <Input
                          flex="2"
                          // minW="100%"
                          h="40px"
                          variant="address"
                          border="1px solid #4D4D4D"
                          value={param.value}
                          onChange={(e) => setParam(idx, "value", e.target.value)}
                          mr="10px"
                        />
                      )}
                      {/* <Spacer /> */}
                      <AiOutlineMinusCircle
                        style={{ minWidth: "18px" }}
                        onClick={() => removeParam(idx)}
                      />
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
            {(result || queryStatus) && (
              <QueryAPIResult result={result} filename={filename} status={queryStatus} />
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryAPIQueryView;
