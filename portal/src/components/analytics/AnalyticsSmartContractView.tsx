import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { getQueryDescription, getRandomQueries } from "../../mocks";
import http from "../../utils/httpMoonstream";
import AnalyticsAddressTags from "./AnalyticsAddressTags";
import AnalyticsQueryView from "./AnalyticsQueryView";
import AnalyticsSmartContractDetails from "./AnalyticsSmartContractDetails";
import AnalyticsSmartContractQueries, { QueryInterface } from "./AnalyticsSmartContractQueries";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const AnalyticsSmartContractView = ({ address }: { address: any }) => {
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const [queries, setQueries] = useState<QueryInterface[]>([]);

  useEffect(() => {
    setSelectedIdx(-1);
  }, [address]);

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

  const chainName = address.subscription_type_id.split("_")[0];

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
    },
  );

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;
  const toast = useMoonToast();
  const getQueries = () => {
    console.log("userQueries");
    return http({
      method: "GET",
      url: `${API}/queries/list`,
    }).then((res) =>
      res.data.map((q: { name: string }) => {
        return { title: q.name.split("_").join(" "), context_url: q.name };
      }),
    );
  };

  const userQueries = useQuery(["queries"], getQueries, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
  });

  // const mockQueries = useQuery(["smartContractQueries", address.id], getMockQueries(address.id), {
  //   ...queryCacheProps,
  //   onError: (error: Error) => {
  //     console.log(error);
  //   },
  //   onSuccess: (data: any) => {
  //     console.log(data);
  //   },
  // });

  useEffect(() => {
    setSelectedIdx(-1);
  }, [address.address]);

  useEffect(() => {
    const templatesArray = templates.data ? templates.data : [];
    const userQueriesArray = userQueries.data ? userQueries.data : [];
    setQueries([...templatesArray, ...userQueriesArray]);
    console.log("qq", templatesArray, userQueriesArray);
  }, [templates.data, userQueries.data]);

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
          chainName={chainName}
          onAdd={handleAddTag}
          onDelete={(t: string) => handleDeleteTag(t)}
        />
        <Text variant="text" pr="160px">
          {address.description}
        </Text>
        <AnalyticsSmartContractDetails
          address={address.address}
          id={address.id}
          chain={chainName}
          isAbi={address.abi === "True"}
        />
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="title2">Analytics</Text>
          {/* {(templates.isLoading || userQueries.isLoading) && <Spinner />}
          {templates.data && <Text>{templates.data.length}</Text>}
          {userQueries.data && <Text>{userQueries.data.length}</Text>} */}
          {/* <Text>{queries.length}</Text> */}
          <Text my="auto" color="#F88F78" fontSize="14px" cursor="pointer">
            Request new
          </Text>
        </Flex>
        {queries && (
          <AnalyticsSmartContractQueries
            queries={queries}
            selectedIdx={selectedIdx}
            onChange={setSelectedIdx}
          />
        )}
        {queries && selectedIdx > -1 && (
          <AnalyticsQueryView
            query={queries[selectedIdx]}
            address={address.address}
            chainName={chainName}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default AnalyticsSmartContractView;
