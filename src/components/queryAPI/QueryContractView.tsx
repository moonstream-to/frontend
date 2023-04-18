import { DeleteIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";
import { Button, Flex, Spacer, Spinner, Text, Textarea } from "@chakra-ui/react";
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
      const address = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359";
      try {
        const response = await axios({
          method: "GET",
          url: `http://api.etherscan.io/api?module=contract&action=getabi&address=${contract.address}`,
        });
        console.log(response.data.result);
        setLoadedABI(JSON.stringify(JSON.parse(response.data.result), null, "\t"));
      } catch (e: any) {
        console.log(e);
      }
      // console.log(JSON.stringify(JSON.parse(response.data.result), null, "\t"));
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

  useEffect(() => {
    if (loadedABI) {
      setJSONForEdit(loadedABI);
    }
  }, [loadedABI]);

  useEffect(() => {
    console.log(contract);
    console.log("qq");
    setJSONForEdit("");
  }, [contract]);

  // useEffect(() => {
  //   console.log(ABI.data);
  // }, [ABI.data]);

  const { data, isLoading, isFetching } = usePresignedURL({
    url: ABI.data?.data?.url,
    isEnabled: !!ABI.data?.data?.url,
    id: contract.id,
    cacheType: "abi",
    requestNewURLCallback: ABI.refetch,
    hideToastOn404: true,
  });

  useEffect(() => {
    setJSONForEdit(JSON.stringify(data, null, "\t"));
  }, [data]);

  useEffect(() => {
    setIsABIChanged(JSONForEdit !== JSON.stringify(data, null, "\t"));
  }, [JSONForEdit]);

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
            <Flex gap="10px" alignItems="center">
              <Text fontSize="16px">Edit</Text>
              <EditIcon />
              {!deleteSubscription.isLoading ? (
                <DeleteIcon onClick={() => deleteSubscription.mutate(contract.id)} />
              ) : (
                <Spinner />
              )}
            </Flex>
          </Flex>
          {contract.subscription_type_id && (
            <Flex gap="10px">
              <ChainTag name={contract.subscription_type_id.split("_")[0]} />
              <Tag name={contract.subscription_type_id.split("_").slice(1).join("")} />
            </Flex>
          )}
          <Flex bg="#232323" borderRadius="10px" p="20px" gap="10px" direction="column">
            <PoolDetailsRow type="Contract address" value={contract.address} />
            <PoolDetailsRow type="id" value={contract.id} />

            {contract.subscription_type_id && (
              <PoolDetailsRow
                type="Blockchain"
                value={contract.subscription_type_id.split("_")[0]}
              />
            )}
            {contract.created_at && (
              <PoolDetailsRow type="Creation date" value={formatDate(contract.created_at)} />
            )}
            {!contract.abi && <PoolDetailsRow type="ABI" value={contract.abi} />}
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
                  onClick={() => {
                    setJSONForEdit(JSON.stringify(data, null, "\t"));
                  }}
                >
                  Cancel
                </Button>
                <Button variant="saveButton" onClick={() => setEditABI(false)}>
                  Save
                </Button>
              </Flex>
            )}
            <Flex justifyContent="space-between">
              <Text pl="20px" fontSize="18px" fontWeight="700">
                Contract ABI
              </Text>
              {!ABIfromScan.isFetching && <DownloadIcon onClick={() => ABIfromScan.refetch()} />}
            </Flex>
            {(ABI.isFetching || isFetching) && <Spinner />}
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
