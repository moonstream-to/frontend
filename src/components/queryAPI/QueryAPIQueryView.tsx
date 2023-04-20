import { DeleteIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";
import { Button, Flex, Spacer, Spinner, Text, Icon, Image, Input, Select } from "@chakra-ui/react";
import { TbDatabaseExport } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useQueryAPI from "../../contexts/QueryAPIContext";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import ChainTag from "../ChainTag";
import Tag from "../Tag";
import PoolDetailsRow from "../PoolDetailsRow";
import usePresignedURL from "../../hooks/usePresignedURL";
import dynamic from "next/dynamic";
import axios from "axios";
import { AWS_ASSETS_PATH } from "../../constants";
import http from "../../utils/httpMoonstream";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import styles from "./QueryAPIQueryView.module.css";
import QueryAPIResult from "./QueryAPIResult";

const icons = {
  ethScan: `${AWS_ASSETS_PATH}/icons/database-load.png`,
  ABIIcon: `${AWS_ASSETS_PATH}/icons/file-down.png`,
};

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

const values = [
  "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f",
  "Transfer",
  "1681958520",
  "1681968684",
];

const QueryAPIQueryView = () => {
  const toast = useMoonToast();
  const { selectedQuery: query } = useQueryAPI();
  const [params, setParams] = useState<{ key: string; value: string }[]>([]);
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("");

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
    params.forEach((param) => (paramsObj[param.key] = param.value));
    console.log(paramsObj);
    const requestTimestamp = Date.now();

    const url0 = await http({
      method: "POST",
      url: `${API}/queries/${query.name}/update_data`,
      data: {
        params: paramsObj,
      },
    })
      .then(async (res: any) => {
        console.log(res);
        // const results = await getFromPresignedURL(res.url);
        // console.log(results);
        return res.data;
      })
      .catch((e) => console.log(e));
    console.log(url0);
    const url =
      "https://moonstream-queries.s3.amazonaws.com/prod/queries/f879abab-b9d8-46c2-9dc2-3d8f0af69659/99914b932bd37a50b983c5e7c90ae93b/data.json?AWSAccessKeyId=ASIASGWXO7DRGSGXKUPD&Signature=VvtajlWN38evNBOmxMzyAZYgvH4%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEH8aCXVzLWVhc3QtMSJHMEUCIFGqLt4%2FEZ%2FrIMI4BN2i16UkksITQ4XnrfhKarGsD0DDAiEA4PZtVgnWV4ZV2fNPqH9CUUazehQFvD9weH1EzRrZf8MquwUIeBACGgwxNTE4NDk0NjYwODIiDNAMxQkGIHcJIqX2OiqYBc%2F8gdDWFMJjZEJY2uf%2Bsw0Piv1RiXkK0MPbHsMT1c4FRV0ZlqyRxkkRHgPvG7%2B4Ha5%2BMHVUSZCQQ5kqYrV2qZl9MkjCl8H44ulh65jpGAJbpXxf%2B2KEpt7SledozFULOZ09z0%2FJ1TqYYr1LKjJ%2F1DLZspqMFrnU%2Fm84Qk1w%2FebFP6t8cEQi2ph6k0FcV9UQImgJF5b8xBjCr2SdL1qoKsvbGGB0N2oB%2F1Vydpb01PSiKaB%2FOvLAKBm6QXLBrth2PsQFVgxRXkv%2BXBa7PpQljEkqVeEkFnrYnADjsi4eBcSLQ7Lh5vWsPV3g8pa%2F3Zw%2F9TnD1nuZfdfHxBKbNl5gK7tn0E0%2BDu2A4Kmkd9LyQX86Mtwwm%2FOBgq7h3Itnv7FvdzRRX2cp4wCbiq0KnHn8vMVXqC25ZshOhnvj8YTJpA8qqGvGW3fT%2BRaZJ%2FqnmKEpQk3CnLdw3m4oliLU7MAlB0qCfgpXm0S8P4iKS3ajxoeDtqt6sByGteJ01X0KrTnrOLRBx3hmdXxkNF2wg23ZXXI3q%2Bt7WlWUMArQPNuqAkpMZYBADt4jb8iF3KvRKYg9rGMA5fsbQv%2B%2BXw%2FVCGKjth7oCouqwxNRwd4qWbQv1jAFFmXHM7aqhsXgPjKDCApsI99U5hWUrczq7HbFuPzfDAE%2FSENaK1DCawyoXC9lYIyHwJuh%2B1C%2B0l3H8WHUzQYpJJ6ULN%2F5PUsc%2B%2FTOod7fKW1RoYuV4qh8jKpUaVsUkRgC8vJPcd5LRzWYrIgYXTK2s9tJVZfgYMJSbO2EyxHZIP6MhA6W2q67Q6JayUmeTbjS85JYjP%2FjermZ5Wy0q95%2BUzCRgMG%2Bg%2F%2B%2B3Cp7cATXZRZ5ilvUFHPnXvlpqEJQXSjQStd%2F2E6aYbsw5vn%2FoQY6sQEF9UuCaD%2FS1NsOqt%2BLzsXCFTjZ9jVoK3P%2BAyQmYvct3L5W7Bsgnim6s%2F%2FYyCxx1xslVPpX6htPxqOwRhLS%2B6qwZvoji4GSUZsglUySW6UmvhMdT%2FB8A0q3InGlVSOFRcdKGbczvLp8kdRFov27mVHnaROmdAanmFuZnf7AQjSGO6Mfi81jpE2VVapN7tTV1eDGdMVTHwQVwHBB3nOOBfZ5eLS3ny5h2lBHsycJt5s%2FZs0%3D&Expires=1681965468";
    const res = await getFromPresignedURL(url0.url, requestTimestamp);
    setResult(JSON.stringify(res, null, "\t"));
    setFilename(`${query.name}_${requestTimestamp}.json`);
    console.log(res);
  };

  interface RequestParameters {
    url?: string;
    headers?: any;
    method?: string;
  }

  const getFromPresignedURL = async (url: string, requestTimestamp: number) => {
    const requestParameters: RequestParameters = {
      url: url,
      // You can uncomment this to use mockupsLibrary in development
      // url: `https://example.com/s3`,
      headers: {
        // "If-Modified-Since": requestTimestamp,
      },
      method: "GET",
    };
    const response = await axios(requestParameters);
    console.log(response);
    return response.data;
  };

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getQuery = () =>
    http({
      method: "GET",
      url: `${API}/queries/${query.name}/query`,
    }).then((res) => {
      console.log(res);
      return res.data;
    });

  const queryData = useQuery(["subscriptonABI", query.name], getQuery, {
    ...queryCacheProps,
    onError: (error: Error) => {
      console.log(error);
    },
    onSettled: (data: any) => {
      console.log(data);
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
          >
            Run
          </Button>
          <Flex justifyContent="space-between" alignItems="center" mb="10px">
            <Text fontSize="24px" fontWeight="700">
              {query.name}
            </Text>
          </Flex>
          {queryData.data && (
            <Flex direction="column" gap="15px">
              {/* {queryData.data.content && (
                <Text maxH="100px" overflowY="auto">
                  {queryData.data.content}
                </Text>
              )} */}
              {queryData.data.tags && (
                <Flex gap="10px">
                  {queryData.data.tags.map((tag: string, idx: number) => (
                    <Tag key={idx} name={tag} />
                  ))}
                </Flex>
              )}
            </Flex>
          )}
          <Flex direction="column" p="0px" overflowY="auto" gap="20px">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="20px" fontWeight="700">
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
                      {/* <Spacer /> */}
                      <AiOutlineMinusCircle onClick={() => removeParam(idx)} />
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
            {result && <QueryAPIResult result={result} filename={filename} />}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryAPIQueryView;
