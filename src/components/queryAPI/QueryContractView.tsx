import { DeleteIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";
import { Button, Flex, Spacer, Spinner, Text, Icon, Image } from "@chakra-ui/react";
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

const icons = {
  ethScan: `${AWS_ASSETS_PATH}/icons/database-load.png`,
  ABIIcon: `${AWS_ASSETS_PATH}/icons/file-down.png`,
};

// import MyJsonComponent from "../JSONEdit";

const MyJsonComponent = dynamic(() => import("../JSONEdit2"), { ssr: false });
// MyJsonComponent.

const formatDate = (dateTimeOffsetString: string) => {
  const date = new Date(dateTimeOffsetString);

  return date.toLocaleDateString();
};

const QueryContractView = () => {
  const toast = useMoonToast();
  const { selectedContract: contract, setSelectedContract } = useQueryAPI();
  const [editABI, setEditABI] = useState(false);
  const [JSONForEdit, setJSONForEdit] = useState("");
  const [isABIChanged, setIsABIChanged] = useState(false);
  const [loadedABI, setLoadedABI] = useState("");
  // const getSubscriptionABI = async () => {
  //   const response = await SubscriptionsService.getSubscriptionABI(contract.id)
  //   console.log(response)
  //   return response.data
  // }

  const ABI = useQuery(
    ["subscriptonABI", contract.id],
    SubscriptionsService.getSubscriptionABI(contract.id),
    {
      ...queryCacheProps,
      onError: (error: Error) => {
        console.log(error);
      },
      onSettled: (data: any) => {
        console.log(data);
      },
      enabled: !!contract.abi,
    },
  );

  const ABIfromScan = useQuery(
    ["abiScan", contract.address],
    async () => {
      return axios({
        method: "GET",
        url: `http://api.etherscan.io/api?module=contract&action=getabi&address=${contract.address}`,
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
      setSelectedContract({});
      queryClient.invalidateQueries("subscriptions");
    },
  });

  // useEffect(() => {
  //   console.log("loaded");
  //   // console.log(loadedABI);
  //   if (loadedABI) {
  //     console.log(loadedABI);
  //     setJSONForEdit(loadedABI);
  //   }
  // }, [loadedABI]);

  useEffect(() => {
    if (ABIfromScan.data?.data?.result) {
      // console.log(ABIfromScan.data.data.result);
      try {
        setJSONForEdit(JSON.stringify(JSON.parse(ABIfromScan.data.data.result), null, "\t"));
      } catch (e) {
        toast(ABIfromScan.data?.data?.result, "error");
      }
    }
  }, [ABIfromScan.data]);

  useEffect(() => {
    // console.log("contract", isABIChanged);

    setJSONForEdit("");
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
    onSuccess: (data: any) => {
      // console.log(data);
      ABI.refetch();
    },
  });

  useEffect(() => {
    // console.log("data, JFE", isABIChanged);

    if (data) {
      setIsABIChanged(JSONForEdit !== JSON.stringify(data, null, "\t"));
    } else {
      setIsABIChanged(JSONForEdit !== "");
    }
  }, [JSONForEdit]);

  useEffect(() => {
    // console.log("JFE, data", isABIChanged, !!data, !!JSONForEdit);
    // console.log(data);
    // console.log(JSONForEdit);
    if (!JSONForEdit) {
      setJSONForEdit(JSON.stringify(data, null, "\t") ?? "");
    }

    // if (data) {
    //   setIsABIChanged(JSONForEdit !== JSON.stringify(data, null, "\t"));
    // } else {
    //   setIsABIChanged(JSONForEdit !== "");
    // }
  }, [JSONForEdit, data]);

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
        >
          <Flex justifyContent="space-between" alignItems="center" mb="10px">
            <Text fontSize="24px" fontWeight="700">
              {contract.label}
            </Text>
            {/* <Flex gap="10px" alignItems="center">
              <Text fontSize="16px">Edit</Text>
              <EditIcon />
              {!deleteSubscription.isLoading ? (
                <DeleteIcon onClick={() => deleteSubscription.mutate(contract.id)} />
              ) : (
                <Spinner />
              )}
            </Flex> */}
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
              {!ABIfromScan.isFetching ? (
                <Button
                  variant="transparent"
                  fontSize="16px"
                  fontWeight="400"
                  onClick={() => ABIfromScan.refetch()}
                  p="0px"
                >
                  {"Load from etherscan"}
                  <Image ml="10px" alt="" src={icons.ethScan} w="16px" h="16px" />
                  {/* <Icon ml="5px" as={TbDatabaseExport} /> */}
                </Button>
              ) : (
                <Spinner />
              )}
            </Flex>
            {(ABI.isFetching || (isFetching && !data)) && (
              <Spinner ml="10px" p="0" h="20px" w="17px" />
            )}
            {/* {data && !ABI.isLoading && !editABI && ( */}
            <MyJsonComponent json={JSONForEdit} onChange={setJSONForEdit} />
            {/* )} */}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryContractView;
