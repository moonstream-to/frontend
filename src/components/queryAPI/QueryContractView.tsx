import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Button, Flex, Spinner, Text, Image } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";
import usePresignedURL from "../../hooks/usePresignedURL";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import { AWS_ASSETS_PATH } from "../../constants";
import { chains } from "../../contexts/Web3Context/";

import ChainTag from "../ChainTag";
import Tag from "../Tag";
import PoolDetailsRow from "../PoolDetailsRow";

const icons = {
  ethScan: `${AWS_ASSETS_PATH}/icons/database-load.png`,
  ABIIcon: `${AWS_ASSETS_PATH}/icons/file-down.png`,
};

const MyJsonComponent = dynamic(() => import("../JSONEdit2"), { ssr: false });

const formatDate = (dateTimeOffsetString: string) => {
  const date = new Date(dateTimeOffsetString);

  return date.toLocaleDateString();
};

const QueryContractView = ({ contract }: { contract: any }) => {
  const toast = useMoonToast();
  const { setSelectedContractId } = useQueryAPI();
  const [JSONForEdit, setJSONForEdit] = useState("");
  const [isABIChanged, setIsABIChanged] = useState(false);
  const [ABILoader, setABILoader] = useState<{ name: string; url: string } | undefined>(undefined);

  const ABI = useQuery(
    ["subscriptonABI", contract.id],
    SubscriptionsService.getSubscriptionABI(contract.id),
    {
      ...queryCacheProps,
      onError: (error: Error) => {
        console.log(error);
      },
      enabled: !!contract.abi,
    },
  );

  const ABIfromScan = useQuery(
    ["abiScan", contract.address],
    async () => {
      return axios({
        method: "GET",
        url: `${ABILoader?.url}&address=${contract.address}`,
      });
    },
    {
      enabled: false,
    },
  );

  const queryClient = useQueryClient();

  const deleteSubscription = useMutation(SubscriptionsService.deleteSubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      setSelectedContractId(0);
      queryClient.invalidateQueries("subscriptions");
    },
  });

  useEffect(() => {
    if (ABIfromScan.data?.data?.result) {
      try {
        setJSONForEdit(JSON.stringify(JSON.parse(ABIfromScan.data.data.result), null, "\t"));
      } catch (e) {
        toast(ABIfromScan.data?.data?.result, "error");
      }
    }
  }, [ABIfromScan.data]);

  useEffect(() => {
    const chain = contract.subscription_type_id?.split("_")[0] as keyof typeof chains;
    if (chains[chain]?.ABIScan) {
      setABILoader(chains[chain]?.ABIScan);
    } else {
      setABILoader(undefined);
    }
    if (!data) {
      setJSONForEdit("");
    } else {
      setJSONForEdit(JSON.stringify(data, null, "\t") ?? "");
    }
  }, [contract]);

  const { data, isLoading, isFetching } = usePresignedURL({
    url: ABI.data?.data?.url,
    isEnabled: !!ABI.data?.data?.url,
    id: contract.id,
    cacheType: "abi",
    requestNewURLCallback: ABI.refetch,
    hideToastOn404: true,
  });

  const updateSubscription = useMutation(SubscriptionsService.modifySubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      ABI.refetch();
    },
  });

  useEffect(() => {
    if (data) {
      setIsABIChanged(JSONForEdit !== JSON.stringify(data, null, "\t"));
    } else {
      setIsABIChanged(JSONForEdit !== "");
    }
  }, [JSONForEdit]);

  useEffect(() => {
    if (!JSONForEdit) {
      setJSONForEdit(JSON.stringify(data, null, "\t") ?? "");
    }
  }, [data]);

  return (
    <>
      {!!contract && (
        <Flex
          direction="column"
          p="30px"
          gap="20px"
          borderRadius="20px"
          bg="#2d2d2d"
          w="100%"
          minH="100%"
          maxW="800px"
          minW="800px"
        >
          <Flex justifyContent="space-between" alignItems="center" mb="10px">
            <Text fontSize="24px" fontWeight="700">
              {contract.label}
            </Text>
          </Flex>
          {contract.subscription_type_id && (
            <Flex gap="10px">
              <ChainTag name={contract.subscription_type_id.split("_")[0]} />
              <Tag name={contract.subscription_type_id.split("_").slice(1).join("")} />
            </Flex>
          )}
          <Flex bg="#232323" borderRadius="10px" p="20px" gap="10px" direction="column">
            <PoolDetailsRow type="Contract address" value={contract.address} />
            {contract.subscription_type_id && (
              <PoolDetailsRow
                type="Blockchain"
                value={contract.subscription_type_id.split("_")[0]}
              />
            )}
            {contract.created_at && (
              <PoolDetailsRow type="Creation date" value={formatDate(contract.created_at)} />
            )}
          </Flex>
          <Flex
            bg="#2d2d2d"
            p="20px"
            borderRadius="10px"
            border="1px solid #4d4d4d"
            direction="column"
            overflowY="auto"
            gap="15px"
            h="100%"
            position="relative"
          >
            {isABIChanged && (
              <Flex gap="20px" position="absolute" zIndex="2" bottom="15px" right="15px">
                <Button
                  variant="cancelButton"
                  disabled={updateSubscription.isLoading}
                  onClick={() => {
                    setJSONForEdit(JSON.stringify(data, null, "\t") ?? "");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="saveButton"
                  disabled={updateSubscription.isLoading}
                  onClick={() => {
                    try {
                      if (JSONForEdit !== JSON.stringify(JSON.parse(JSONForEdit))) {
                        throw new Error("not valid JSON");
                      }
                      updateSubscription.mutate({ id: contract.id, abi: JSONForEdit });
                    } catch (e: any) {
                      toast(e.message, "error", 7000);
                    }
                  }}
                >
                  {updateSubscription.isLoading ? <Spinner /> : "Save"}
                </Button>
              </Flex>
            )}
            <Flex justifyContent="space-between" alignItems="center">
              <Flex gap="10px" alignItems="center">
                <Image alt="" src={icons.ABIIcon} h="20px" w="20px" />
                <Text fontSize="18px" fontWeight="700">
                  Contract ABI
                </Text>
              </Flex>
              {ABILoader && !ABIfromScan.isFetching && (
                <Button
                  variant="transparent"
                  fontSize="16px"
                  fontWeight="400"
                  onClick={() => ABIfromScan.refetch()}
                  p="0px"
                >
                  {`Load from ${ABILoader.name}`}
                  <Image ml="10px" alt="" src={icons.ethScan} w="16px" h="16px" />
                </Button>
              )}
              {ABILoader && ABIfromScan.isFetching && <Spinner />}
            </Flex>
            {(ABI.isFetching || (isFetching && !data)) && (
              <Spinner ml="10px" p="0" h="20px" w="17px" />
            )}
            <MyJsonComponent json={JSONForEdit} onChange={setJSONForEdit} />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryContractView;
