import { EditIcon } from "@chakra-ui/icons";
import { Button, Flex, Spacer, Spinner, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useQueryAPI from "../../contexts/QueryAPIContext";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import ChainTag from "../ChainTag";
import Tag from "../Tag";
import PoolDetailsRow from "../PoolDetailsRow";
import usePresignedURL from "../../hooks/usePresignedURL";
import dynamic from "next/dynamic";
// import MyJsonComponent from "../JSONEdit";

const MyJsonComponent = dynamic(() => import("../JSONEdit2"), { ssr: false });
// MyJsonComponent.

const formatDate = (dateTimeOffsetString: string) => {
  return dateTimeOffsetString.slice(0, 10).split("-").reverse().join("/");
};

const QueryContractView = () => {
  const toast = useMoonToast();
  const { selectedContract: contract } = useQueryAPI();
  const [editABI, setEditABI] = useState(false);
  const [JSONForEdit, setJSONForEdit] = useState("");
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
      onError: (error) => {
        toast(error, "error");
      },
      onSettled: (data: any) => {
        console.log(data);
      },
      enabled: !!contract.id,
    },
  );

  // useEffect(() => {
  //   console.log(contract);
  // }, [contract]);

  // useEffect(() => {
  //   console.log(ABI.data);
  // }, [ABI.data]);

  const { data, isLoading, isFetching } = usePresignedURL({
    url: ABI.data?.data?.url,
    isEnabled: true,
    id: contract.id,
    cacheType: "abi",
    requestNewURLCallback: ABI.refetch,
  });

  useEffect(() => {
    setJSONForEdit(JSON.stringify(data, null, "\t"));
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
        >
          <Flex justifyContent="space-between" alignItems="center" mb="10px">
            <Text fontSize="24px" fontWeight="700">
              {contract.label}
            </Text>
            <Flex gap="10px" alignItems="center">
              <Text fontSize="16px">Edit</Text>
              <EditIcon />
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
            {editABI && (
              <Button
                position="absolute"
                bottom="15px"
                right="15px"
                variant="cancelButton"
                onClick={() => setEditABI(false)}
                zIndex="2"
              >
                Cancel
              </Button>
            )}
            <Flex justifyContent="space-between">
              <Text pl="20px" fontSize="18px" fontWeight="700">
                Contract ABI
              </Text>
              {!editABI && <EditIcon cursor="pointer" onClick={() => setEditABI(true)} />}
            </Flex>
            {(ABI.isLoading || isFetching) && <Spinner />}
            {data && !ABI.isLoading && !editABI && (
              <MyJsonComponent json={JSONForEdit} onChange={setJSONForEdit} />
            )}
            {data && !ABI.isLoading && editABI && (
              <Textarea
                h="100%"
                value={JSONForEdit}
                onChange={(e) => setJSONForEdit(e.target.value)}
              />
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryContractView;
