import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Button, Flex, Spinner, Text, Image } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import { AWS_ASSETS_PATH } from "../../constants";
import { chains } from "../../contexts/Web3Context/";

import ChainTag from "../ChainTag";
import Tag from "../Tag";
import PoolDetailsRow from "../PoolDetailsRow";
import http from "../../utils/httpMoonstream";
import { DeleteIcon } from "@chakra-ui/icons";

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

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getSubscriptionABI = (id: string) => () => {
    return http({
      method: "GET",
      url: `${API}/subscriptions/${id}/abi`,
    }).then((res) => JSON.stringify(JSON.parse(res.data?.abi), null, "\t"));
  };

  const abi = useQuery(["subscriptonABI", contract.id], getSubscriptionABI(contract.id), {
    ...queryCacheProps,
    onError: (error: Error) => {
      console.log(error);
    },
    onSuccess: (data: any) => {
      console.log(data);
    },
    enabled: !!contract.abi,
  });

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
    if (!abi.data) {
      setJSONForEdit("");
    } else {
      setJSONForEdit(abi.data ?? "");
    }
  }, [contract]);

  const updateSubscription = useMutation(SubscriptionsService.modifySubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      abi.refetch();
    },
  });

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
            {!deleteSubscription.isLoading ? (
              <DeleteIcon onClick={() => deleteSubscription.mutate(contract.id)} />
            ) : (
              <Spinner />
            )}
          </Flex>
          {contract.subscription_type_id && (
            <Flex gap="10px">
              <ChainTag name={contract.subscription_type_id.split("_")[0]} />
              <Tag name={contract.subscription_type_id.split("_").slice(1).join("")} />
            </Flex>
          )}
          <Flex bg="#232323" borderRadius="10px" p="20px" gap="10px" direction="column">
            <PoolDetailsRow type="Contract address" value={contract.address} canBeCopied />
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
            {isABIChanged && !abi.isLoading && (
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
            {abi.isFetching && !abi.data && <Spinner ml="10px" p="0" h="20px" w="17px" />}
            <MyJsonComponent json={JSONForEdit} onChange={setJSONForEdit} />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryContractView;
