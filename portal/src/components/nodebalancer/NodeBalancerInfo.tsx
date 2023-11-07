import React from "react";
import { Flex, Text, Spinner } from "@chakra-ui/react";

import { useQuery } from "react-query";
import axios from "axios";
import PoolDetailsRow from "../PoolDetailsRow";
import { formatDuration, timestampToHumanDate } from "../../utils/timeFormat";

interface NodeBalancerResourceData {
  access_id: string;
  description: string;
  blockchain_access: boolean;
  max_calls_per_period: number;
  period_duration: number;
  period_start_ts: number;
  calls_per_period: number;
  type: string;
}

interface NodeBalancerApiResponse {
  resources: Array<{
    resource_data: NodeBalancerResourceData;
  }>;
}

const NodeBalancerInfo = () => {
  const nodeBalancerAccess = useQuery<NodeBalancerResourceData[], Error>(
    ["nodeBalancerAccess"],
    () => {
      const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
      const authorization = token ? { Authorization: `Bearer ${token}` } : {};

      return axios
        .get<NodeBalancerApiResponse>(
          "https://auth.bugout.dev/resources?type=nodebalancer-access",
          {
            headers: {
              "Content-Type": "application/json",
              ...authorization,
            },
          },
        )
        .then((res) => {
          const nodeBalancerResources = res.data.resources.filter(
            (r) => r.resource_data?.type === "nodebalancer-access",
          );
          return nodeBalancerResources.map((r) => r.resource_data);
        });
    },
  );

  return (
    <Flex
      direction="column"
      p="30px"
      gap="20px"
      borderRadius="20px"
      bg="#2d2d2d"
      minH="100%"
      minW="860px"
      position="relative"
      mx="auto"
      mt={"40px"}
    >
      <Text placeSelf="center" fontSize="22px" fontWeight="700" mb="20px">
        Nodebalancer access info
      </Text>
      {nodeBalancerAccess.isLoading && <Spinner />}
      {nodeBalancerAccess.data && (
        <Flex direction={"column"} gap={"20px"} w={"100%"}>
          {nodeBalancerAccess.data.map((item, idx: number) => (
            <Flex
              direction="column"
              gap="10px"
              alignItems="start"
              key={item.access_id}
              w={"100%"}
              pl={"10px"}
            >
              <Text fontSize="18px" ml={-6}>{`${idx + 1}. ${item.description}`}</Text>
              <PoolDetailsRow
                type="Access id"
                value={item.access_id}
                w="100%"
                range={{ atStart: 4, atEnd: 4 }}
                canBeCopied
              />
              <PoolDetailsRow
                type="Active"
                value={item.blockchain_access ? "Yes" : "No"}
                w="100%"
              />
              <PoolDetailsRow
                type="Limit"
                value={`${item.max_calls_per_period}/${formatDuration(item.period_duration)}`}
                w="100%"
                whiteSpace={"nowrap"}
              />
              <PoolDetailsRow
                type="New period starts at:"
                value={timestampToHumanDate(item.period_duration + item.period_start_ts)}
                w="100%"
                whiteSpace={"nowrap"}
              />
              <PoolDetailsRow
                type="Calls made"
                displayFull={true}
                value={String(item.calls_per_period)}
                w="100%"
              />
              <PoolDetailsRow
                type="Calls left"
                displayFull={true}
                value={String(item.max_calls_per_period - item.calls_per_period)}
                w="100%"
              />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default NodeBalancerInfo;
