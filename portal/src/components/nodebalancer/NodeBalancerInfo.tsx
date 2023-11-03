import React from "react";
import { Flex, Text, Spinner } from "@chakra-ui/react";

import { useQuery } from "react-query";
import axios from "axios";
import PoolDetailsRow from "../PoolDetailsRow";

function formatDuration(seconds: number) {
  // Calculate the number of days, hours, minutes, and seconds
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  const mins = Math.floor(seconds / 60);
  seconds -= mins * 60;

  // Create an array to hold the formatted parts
  const parts = [];

  // Add the parts to the array if they are greater than 0
  if (days > 0) {
    parts.push(days + (days > 1 ? " days" : " day"));
  }
  if (hrs > 0) {
    parts.push(hrs + (hrs > 1 ? " hours" : " hour"));
  }
  if (mins > 0) {
    parts.push(mins + (mins > 1 ? " minutes" : " minute"));
  }
  if (seconds > 0) {
    parts.push(seconds + (seconds > 1 ? " seconds" : " second"));
  }

  // If there's nothing in the parts array, then the duration was 0 seconds
  if (parts.length === 0) {
    return "0 seconds";
  }

  // Join the parts into a string and return it
  return parts.join(", ");
}

function timestampToHumanDate(timestamp: number) {
  // Create a new Date object with the Unix timestamp
  const date = new Date(timestamp * 1000);

  // Format the date into a human friendly string
  return date.toLocaleString();
}

const NodeBalancerInfo = () => {
  const nodeBalancerAccess = useQuery(["nodeBalancerAccess"], () => {
    const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
    const authorization = token ? { Authorization: `Bearer ${token}` } : {};

    return axios
      .get("https://auth.bugout.dev/resources?type=nodebalancer-access", {
        headers: {
          "Content-Type": "application/json",
          ...authorization,
        },
      })
      .then((res: any) => {
        const nodeBalancerResources = res.data.resources.filter(
          (r: any) => r.resource_data?.type === "nodebalancer-access",
        );
        return nodeBalancerResources.map((r: any) => r.resource_data);
      });
  });

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
          {nodeBalancerAccess.data.map((item: any, idx: number) => (
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