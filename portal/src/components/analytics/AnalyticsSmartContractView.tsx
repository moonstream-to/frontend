import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ChainName } from "../../constants";
import useAnalytics from "../../contexts/AnalyticsContext";
import queryCacheProps from "../../hooks/hookCommon";
import { getQueryDescription, getRandomQueries } from "../../mocks";
import http from "../../utils/httpMoonstream";
import AnalyticsAddressTags from "./AnalyticsAddressTags";
import AnalyticsQueryView from "./AnalyticsQueryView";
import AnalyticsSmartContractDetails from "./AnalyticsSmartContractDetails";
import AnalyticsSmartContractQueries from "./AnalyticsSmartContractQueries";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const AnalyticsSmartContractView = ({ address }: { address: any }) => {
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const handleAddTag = (newTag: string) => {
    //TODO add tag to DB
  };

  const handleDeleteTag = (tag: string) => {
    // TODO delete tag from DB
  };

  const getMockQueries = (id: string) => () => {
    return getRandomQueries().map((query: string) => {
      return { title: query, context_url: "", description: getQueryDescription(query) };
    });
  };

  const templates = useQuery(
    ["queryTemplates"],
    () => {
      return http({
        method: "GET",
        url: `${API}/queries/templates`,
      }).then((res) => res.data.queries);
    },
    {
      ...queryCacheProps,
      onError: (error: Error) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        console.log(data);
      },
    },
  );

  const mockQueries = useQuery(["smartContractQueries", address.id], getMockQueries(address.id), {
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
          <Text my="auto" color="#F88F78" fontSize="14px" cursor="pointer">
            Request new
          </Text>
        </Flex>
        {templates.data && (
          <AnalyticsSmartContractQueries
            queries={templates.data}
            selectedIdx={selectedIdx}
            onChange={setSelectedIdx}
          />
        )}
        {templates.data && selectedIdx > -1 && (
          <AnalyticsQueryView query={templates.data[selectedIdx]} />
        )}
      </Flex>
    </Flex>
  );
};

export default AnalyticsSmartContractView;
