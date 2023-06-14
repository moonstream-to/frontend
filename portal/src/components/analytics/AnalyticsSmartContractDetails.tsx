import { Box, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import http, { axios } from "../../utils/httpMoonstream";
import PoolDetailsRow from "../PoolDetailsRow";
import { chains } from "../../contexts/Web3Context/";
import { AWS_ASSETS_PATH_CF } from "../../constants";
import dynamic from "next/dynamic";
// import MyJsonComponent from "../JSONEdit2";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;
const icons = {
  ethScan: `${AWS_ASSETS_PATH_CF}/icons/database-load.png`,
  ABIIcon: `${AWS_ASSETS_PATH_CF}/icons/file-down.png`,
};

const MyJsonComponent = dynamic(() => import("../JSONEdit2"), { ssr: false });

const AnalyticsSmartContractDetails = ({
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
  });

  const ABIfromScan = useQuery(
    ["abiScan", address],
    async () => {
      return axios({
        method: "GET",
        url: `${ABILoader?.url}&address=${address}`,
      });
    },
    {
      enabled: false,
    },
  );

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
      } catch (e) {
        toast(ABIfromScan.data?.data?.result, "error");
      }
    }
  }, [ABIfromScan.data]);

  useEffect(() => {
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
  }, [chain, address]);

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
      flex="1 1 0px"
      direction="column"
      gap="10px"
      p="15px"
      borderRadius="10px"
      bg="#232323"
      // maxW="595px"
    >
      <Accordion allowMultiple>
        <AccordionItem border="none">
          <AccordionButton p="0">
            <Flex
              justifyContent="space-between"
              w="100%"
              textAlign="right"
              // pr="10px"
              fontWeight="700"
              fontSize="16px"
            >
              Contract details
            </Flex>
            <Spacer />
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p="0">
            <Flex direction="column" mt="20px">
              <PoolDetailsRow
                displayFull={true}
                canBeCopied={true}
                type={"Contract address"}
                value={address}
                fontSize="14px"
              />
              <Flex w="100%" bg="#4D4D4D" h="1px" mt="20px" mb="12px" />
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
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

export default AnalyticsSmartContractDetails;
