import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AWS_ASSETS_PATH_CF, ChainName, getChainImage } from "../../constants";
import useAnalytics from "../../contexts/AnalyticsContext";
import queryCacheProps from "../../hooks/hookCommon";
import { getQueryDescription, getRandomQueries } from "../../mocks";
import http from "../../utils/httpMoonstream";
import AnalyticsAddressTags from "./AnalyticsAddressTags";
import AnalyticsQueryView from "./AnalyticsQueryView";
import AnalyticsSmartContractDetails from "./AnalyticsSmartContractDetails";
import AnalyticsSmartContractQueries from "./AnalyticsSmartContractQueries";
const metamaskIcon = `${AWS_ASSETS_PATH_CF}/icons/metamask.png`;
const chainNames: ChainName[] = ["ethereum", "polygon", "mumbai", "xdai", "wyrm"];

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const AnalyticsSmartContractView = ({ address }: { address: any }) => {
  const { addresses, setIsCreatingAddress } = useAnalytics();
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const handleAddTag = (newTag: string) => {
    //TODO add tag to DB
  };

  const handleDeleteTag = (tag: string) => {
    // TODO delete tag from DB
  };

  const getContractQueries = (id: string) => () => {
    // return http({
    //   method: "GET",
    //   url: `${API}/subscriptions/${id}/queries`,
    // }).then((res) => JSON.stringify(JSON.parse(res.data?.abi), null, "\t"));
    return getRandomQueries().map((query: string) => {
      return { name: query, description: getQueryDescription(query) };
    });
  };

  const queries = useQuery(["smartContractQueries", address.id], getContractQueries(address.id), {
    ...queryCacheProps,
    onError: (error: Error) => {
      console.log(error);
    },
    onSuccess: (data: any) => {
      console.log(data);
    },
  });

  useEffect(() => {
    setSelectedIdx(-1);
  }, [address.address]);

  return (
    <Flex
      borderRadius="20px"
      bg="#2d2d2d"
      w="100%"
      minH="100%"
      maxW="800px"
      minW="800px"
      direction="column"
      overflowY="auto"
    >
      <Flex direction="column" p="30px" gap="30px" w="100%">
        <Text variant="title">{address.label}</Text>
        <AnalyticsAddressTags
          tags={address.tags}
          chainName={address.subscription_type_id.split("_")[0]}
          onAdd={handleAddTag}
          onDelete={(t: string) => handleDeleteTag(t)}
        />
        <Text variant="text" pr="160px">
          {address.description}
        </Text>
        <AnalyticsSmartContractDetails
          address={address.address}
          id={address.id}
          chain={address.subscription_type_id.split("_")[0]}
        />
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="title2">Analytics</Text>
          <Text color="#F88F78" fontSize="14px" cursor="pointer">
            Request new
          </Text>
        </Flex>
        {queries.data && (
          <AnalyticsSmartContractQueries
            queries={queries.data}
            selectedIdx={selectedIdx}
            onChange={setSelectedIdx}
          />
        )}
        {queries.data && selectedIdx > -1 && (
          <AnalyticsQueryView query={queries.data[selectedIdx]} />
        )}
      </Flex>
    </Flex>
  );
};

export default AnalyticsSmartContractView;
