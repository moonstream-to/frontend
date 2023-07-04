import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Flex, Text } from "@chakra-ui/layout";
import { Button, Image, Spinner } from "@chakra-ui/react";
import useMoonToast from "../../hooks/useMoonToast";

import { SubscriptionsService } from "../../services";
import http, { axios } from "../../utils/httpMoonstream";
import { chains } from "../../contexts/Web3Context/";
import { AWS_ASSETS_PATH_CF } from "../../constants";
import queryCacheProps from "../../hooks/hookCommon";
import AnalyticsABIHeader from "./AnalyticsABIHeader";

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
  isAbi,
  setABI,
}: {
  address: string;
  chain: string;
  id: string;
  isAbi: boolean;
  setABI?: (arg0: string) => void;
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

  const abi = useQuery(["subscriptionABI", id], getSubscriptionABI(id), {
    onError: (error: Error) => {
      console.log(error);
    },
    onSuccess: (data): any => {
      setJSONForEdit(data);
    },
    enabled: id !== "-1" && isAbi,
    retry: false,
  });

  const ABIfromScan = useQuery(
    ["abiScan", address, chain],
    async () => {
      setABIStatus("");
      if (chains[chain as keyof typeof chains]?.ABIScan?.url) {
        return axios({
          method: "GET",
          url: `${chains[chain as keyof typeof chains]?.ABIScan?.url}&address=${address}`,
        });
      } else {
        return new Promise((_, reject) => {
          return reject(new Error("no scan url"));
        });
      }
    },
    {
      ...queryCacheProps,
      retry: false,
      enabled: false,
      onSuccess: (data: any) => {
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
  const queryClient = useQueryClient();
  const updateSubscription = useMutation(SubscriptionsService.modifySubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      queryClient.invalidateQueries("subscriptionABI");
      abi.refetch();
    },
  });

  useEffect(() => {
    setABIStatus("");
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
    if (id === "-1") {
      ABIfromScan.refetch();
    }
  }, [chain, address, id]);

  useEffect(() => {
    if (abi.data) {
      setIsABIChanged(JSONForEdit !== abi.data);
    } else {
      setIsABIChanged(JSONForEdit !== "");
    }
    if (setABI) {
      setABI(JSONForEdit);
    }
  }, [JSONForEdit, abi.data]);

  const handleSave = () => {
    let JSONForSave = "";
    try {
      JSONForSave = JSON.stringify(JSON.parse(JSONForEdit));
      updateSubscription.mutate({ id, abi: JSONForSave });
    } catch (e: any) {
      toast(e.message, "error", 7000);
    }
  };

  return (
    <Flex
      borderRadius="10px"
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
          <Button variant="saveButton" disabled={updateSubscription.isLoading} onClick={handleSave}>
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
      <AnalyticsABIHeader
        ABILoader={ABILoader}
        ABIStatus={ABIStatus}
        ABIfromScan={ABIfromScan}
        isABIfromScan={isABIfromScan}
        setJSONForEdit={setJSONForEdit}
        JSONForEdit={JSONForEdit}
        abi={abi}
      />
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
