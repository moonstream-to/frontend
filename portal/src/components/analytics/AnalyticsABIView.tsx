import { Flex, Text } from "@chakra-ui/layout";
import { Button, Image, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import http, { axios } from "../../utils/httpMoonstream";
import { chains } from "../../contexts/Web3Context/";
import { AWS_ASSETS_PATH_CF } from "../../constants";
import dynamic from "next/dynamic";
import { AiOutlineClockCircle, AiOutlineSync } from "react-icons/ai";
import queryCacheProps from "../../hooks/hookCommon";
// import MyJsonComponent from "../JSONEdit2";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;
const icons = {
  ethScan: `${AWS_ASSETS_PATH_CF}/icons/database-load.png`,
  ABIIcon: `${AWS_ASSETS_PATH_CF}/icons/file-down.png`,
};

const MyJsonComponent = dynamic(() => import("../JSONEdit2"), { ssr: false });

const AnalyticsABIView = ({
  address,
  chain,
  id,
}: {
  address: string;
  chain: string;
  id: string;
}) => {
  const [JSONForEdit, setJSONForEdit] = useState("");
  const [isABIChanged, setIsABIChanged] = useState(false);
  const [ABILoader, setABILoader] = useState<{ name: string; url: string } | undefined>(undefined);
  const [ABIStatus, setABIStatus] = useState("");
  const [scannedABI, setScannedABI] = useState("");

  const getSubscriptionABI = (id: string) => () => {
    return http({
      method: "GET",
      url: `${API}/subscriptions/${id}/abi`,
    }).then((res) => JSON.stringify(JSON.parse(res.data?.abi), null, "\t"));
  };

  const abi = useQuery(["subscriptonABI", id], getSubscriptionABI(id), {
    onError: (error: Error) => {
      console.log(error);
    },
    onSuccess: (data: any) => {
      // console.log(data);
    },
    enabled: id !== "-1",
  });

  const ABIfromScan = useQuery(
    ["abiScan", address, chain],
    async () => {
      setABIStatus("");
      return axios({
        method: "GET",
        url: `${ABILoader?.url}&address=${address}`,
      });
    },
    {
      ...queryCacheProps,
      retry: false,
      enabled: false,
      onSuccess: (data: any) => {
        console.log(data);
        try {
          const json = JSON.stringify(JSON.parse(data.data?.result), null, "\t");
          setScannedABI(json);
          setJSONForEdit(json);
          setABIStatus("loaded");
        } catch (e) {
          setABIStatus("error");
          console.log(e);
        }
      },
      onError: (e: unknown) => {
        console.log(e);
        setABIStatus("error");
      },
    },
  );

  const isABIfromScan = scannedABI === JSONForEdit && scannedABI !== "";

  const toast = useMoonToast();
  const updateSubscription = useMutation(SubscriptionsService.modifySubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      abi.refetch();
    },
  });

  useEffect(() => {
    if (ABIfromScan.data?.data?.result) {
      try {
        setJSONForEdit(JSON.stringify(JSON.parse(ABIfromScan.data.data.result), null, "\t"));
        // setABIStatus("");
        // console.log(isABIfromScan, scannedABI, JSONForEdit);
      } catch (e) {
        // toast(ABIfromScan.data?.data?.result, "error");
      }
    }
  }, [ABIfromScan.data]);

  useEffect(() => {
    if (chains[chain as keyof typeof chains]?.ABIScan) {
      setABILoader(chains[chain as keyof typeof chains]?.ABIScan);
    } else {
      setABILoader(undefined);
    }
    if (!abi.data) {
      setJSONForEdit("");
    } else {
      setJSONForEdit(abi.data ?? "");
    }
    if (id === "-1" && ABILoader) {
      ABIfromScan.refetch();
    }
  }, [chain, address, id]);

  useEffect(() => {
    if (abi.data) {
      setIsABIChanged(JSONForEdit !== abi.data);
    } else {
      setIsABIChanged(JSONForEdit !== "");
    }
  }, [JSONForEdit, abi.data]);

  useEffect(() => {
    if (!JSONForEdit && abi.data) {
      setJSONForEdit(abi.data);
    }
  }, [abi.data]);

  return (
    <Flex
      // bg="#2d2d2d"
      // p="20px"
      borderRadius="10px"
      // border="1px solid #4d4d4d"
      direction="column"
      overflowY="auto"
      gap="15px"
      h="100%"
      position="relative"
      w="100%"
    >
      {isABIChanged && !abi.isLoading && id !== "-1" && (
        <Flex gap="20px" position="absolute" zIndex="2" bottom="15px" right="15px">
          <Button
            variant="cancelButton"
            disabled={updateSubscription.isLoading}
            onClick={() => {
              setJSONForEdit(abi.data ?? "");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="saveButton"
            disabled={updateSubscription.isLoading}
            onClick={() => {
              try {
                if (JSONForEdit !== JSON.stringify(JSON.parse(JSONForEdit), null, "\t")) {
                  throw new Error("not valid JSON");
                }
                updateSubscription.mutate({ id, abi: JSONForEdit });
              } catch (e: any) {
                toast(e.message, "error", 7000);
              }
            }}
          >
            {updateSubscription.isLoading ? <Spinner /> : "Save"}
          </Button>
        </Flex>
      )}
      <Flex justifyContent="space-between" alignItems="center" py="0px">
        <Flex gap="10px" alignItems="center">
          <Image alt="" src={icons.ABIIcon} h="20px" w="20px" />
          <Text fontSize="16px" fontWeight="700">
            Contract ABI
          </Text>
        </Flex>
        {ABILoader && !ABIfromScan.isFetching && !isABIfromScan && ABIStatus !== "error" && (
          <Button
            variant="transparent"
            fontSize="14px"
            fontWeight="400"
            onClick={() => ABIfromScan.refetch()}
            p="0px"
          >
            {`Load from ${ABILoader.name}`}
            <Image ml="10px" alt="" src={icons.ethScan} w="14px" h="14px" />
          </Button>
        )}
      </Flex>
      {ABILoader && ABIfromScan.isFetching && (
        <Flex justifyContent="start" gap="10px">
          <Spinner />
          <Text fontSize="14px">{`We are loading ABI from ${ABILoader.name}. Please wait or paste it below manually.`}</Text>
        </Flex>
      )}
      {abi.isFetching && !abi.data && <Spinner ml="10px" p="0" h="20px" w="17px" />}

      {ABIStatus === "error" && (
        <Flex justifyContent="space-between" fontSize="14px">
          <Flex gap="10px" alignItems="center">
            <AiOutlineClockCircle color="red" width="14px" height="14px" />
            <Text>
              We couldn’t find the ABI automatically. Try again or paste it below manually.
            </Text>
          </Flex>
          <Flex
            gap="10px"
            alignItems="center"
            onClick={() => ABIfromScan.refetch()}
            cursor="pointer"
          >
            <Text>Try again</Text>
            <AiOutlineSync width="14px" height="14px" />
          </Flex>
        </Flex>
      )}
      {isABIfromScan && JSONForEdit !== "" && (
        <Flex justifyContent="space-between" fontSize="14">
          <Flex gap="10px" alignItems="center">
            <Text>{`Loaded from ${ABILoader?.name}`}</Text>
            <AiOutlineSync width="14px" height="14px" />
          </Flex>
          <Text cursor="pointer" variant="transparent" onClick={() => setJSONForEdit("")}>
            Clear
          </Text>
        </Flex>
      )}
      {JSONForEdit !== "" && !isABIfromScan && (
        <Flex justifyContent="end" fontSize="14">
          <Text cursor="pointer" variant="transparent" onClick={() => setJSONForEdit("")}>
            Clear
          </Text>
        </Flex>
      )}
      <MyJsonComponent
        json={JSONForEdit}
        onChange={(value) => {
          setJSONForEdit(value);
          setABIStatus("");
        }}
      />
    </Flex>
  );
};

export default AnalyticsABIView;
