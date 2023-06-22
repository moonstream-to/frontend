import { Flex, Link, Spacer, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import http from "../../utils/httpMoonstream";
import AnalyticsAddressTags from "./AnalyticsAddressTags";
import AnalyticsChainSelector from "./AnalyticsChainSelector";
import AnalyticsEOADetails from "./AnalyticsEOADetails";
import AnalyticsQueryView from "./AnalyticsQueryView";
import AnalyticsSmartContractDetails from "./AnalyticsSmartContractDetails";
import AnalyticsSmartContractQueries, { QueryInterface } from "./AnalyticsSmartContractQueries";

const AnalyticsSmartContractView = ({ address }: { address: any }) => {
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const [queries, setQueries] = useState<QueryInterface[]>([]);
  const [eoaChain, setEoaChain] = useState("");

  useEffect(() => {
    setSelectedIdx(-1);
  }, [address]);

  const handleAddTag = (newTag: string) => {
    //TODO add tag to DB
  };

  const handleDeleteTag = (tag: string) => {
    // TODO delete tag from DB
  };

  const chainName = address.type === "eoa" ? eoaChain : address.subscription_type_id.split("_")[0];

  const templates = useQuery(
    ["queryTemplates", address],
    () => {
      return http({
        method: "GET",
        url: `${API}/queries/templates`,
      }).then((res) => {
        const EOAQueries = res.data.interfaces?.EOA;
        const queries = res.data.queries;
        if (address.type === "smartcontract") {
          return queries.filter(
            (query: any) => !EOAQueries.some((q: any) => q.context_url === query.context_url),
          );
        } else {
          return EOAQueries;
        }
      });
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
    return http({
      method: "GET",
      url: `${API}/queries/list`,
    }).then((res) => {
      return res.data.map((q: { name: string }) => {
        return { title: q.name.split("_").join(" "), context_url: q.name };
      });
    });
  };

  const userQueries = useQuery(["queries", address], getQueries, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
    enabled: false && address.type === "smartcontract",
  });

  useEffect(() => {
    setSelectedIdx(-1);
  }, [address.address]);

  useEffect(() => {
    const templatesArray = templates.data ? templates.data : [];
    const userQueriesArray = userQueries.data ? userQueries.data : [];
    setQueries([...templatesArray, ...userQueriesArray]);
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
        {address.type === "smartcontract" && (
          <AnalyticsAddressTags
            tags={address.tags}
            chainName={chainName}
            // onAdd={handleAddTag}
            onDelete={(t: string) => handleDeleteTag(t)}
          />
        )}
        <Text variant="text" pr="160px">
          {address.description}
        </Text>
        {address.type === "smartcontract" ? (
          <AnalyticsSmartContractDetails
            address={address.address}
            id={address.id}
            chain={chainName}
            isAbi={address.abi === "True"}
          />
        ) : (
          <AnalyticsEOADetails address={address.address} created_at={address.created_at} />
        )}
        <Flex justifyContent="space-between" alignItems="center" gap="20px">
          <Text variant="title2">Analytics</Text>
          {(userQueries.isLoading || templates.isLoading) && <Spinner size="sm" />}
          <Spacer />
          <Link isExternal href="https://discord.gg/K56VNUQGvA" _hover={{ textDecoration: "none" }}>
            <Text my="auto" color="#F88F78" fontSize="14px" cursor="pointer">
              Request new
            </Text>
          </Link>
        </Flex>
        {address.type === "eoa" && (
          <AnalyticsChainSelector selectedChain={eoaChain} setSelectedChain={setEoaChain} />
        )}
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
            type={address.type}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default AnalyticsSmartContractView;
