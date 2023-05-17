import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Text, Flex, Spinner } from "@chakra-ui/react";

import Layout from "../../src/components/layout";
import queryCacheProps from "../../src/hooks/hookCommon";
import useMoonToast from "../../src/hooks/useMoonToast";

const BUGOUT_STATUS_URL = process.env.NEXT_PUBLIC_BUGOUT_STATUS_URL;

const serviceNames = new Map([
  ["moonstream_api", "Backend server"],
  ["moonstream_crawlers", "Crawlers server"],
  ["moonstream_node_balancer", "Node balancer server"],
  ["moonstream_database", "Database server"],
  ["moonstream_database_replica", "Database replica server"],
]);

const Status = () => {
  const toast = useMoonToast();
  const getServerListStatus = async () => {
    const response = await axios({
      method: "GET",
      url: `${BUGOUT_STATUS_URL}/status`,
    });
    const list = response.data.map((s: any) => {
      const name = serviceNames.get(s.name) ?? s.name.replace(/_/g, " ").replace(/api/g, "API");
      const details = Object.keys(s.response)
        .filter((key) => key !== "status")
        .map((key) => {
          return { key: key.replace(/_/g, " "), value: s.response[key] };
        });
      const isHealthy = s.status_code === 200;
      return { name, details, isHealthy };
    });
    return list;
  };

  const status = useQuery("serverListStatus", getServerListStatus, {
    ...queryCacheProps,
    onError: (e: Error) => {
      toast(e.message, "error");
    },
    retry: 0,
  });

  const StatusRow = ({
    service,
  }: {
    service: { name: string; isHealthy: boolean; details: { key: string; value: string }[] };
  }) => {
    const healthyStatusText = "Available";
    const downStatusText = "Unavailable";
    const healthyStatusColor = "green.1000";
    const downStatusColor = "red.600";
    return (
      <Flex direction="column" gap="10px">
        <Flex justifyContent="space-between" fontSize="18px" fontWeight="700">
          <Text textTransform="capitalize">{service.name}</Text>
          <Text color={service.isHealthy ? healthyStatusColor : downStatusColor}>
            {service.isHealthy ? healthyStatusText : downStatusText}
          </Text>
        </Flex>
        <Flex direction="column" ml="10px" gap="5px">
          {service.details.map((d, idx) => (
            <Flex key={idx} justifyContent="space-between" gap="30px">
              <Text>{d.key}</Text>
              <Text fontFamily="Jet Brains Mono, monospace">{d.value}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  };
  return (
    <>
      <Layout home={false} title="Moonstream: Status page">
        <Flex mx="auto">
          <Text fontSize="24px" fontWeight="700" mb="30px">
            Status page
          </Text>
          {status.isLoading && <Spinner />}
        </Flex>
        {status.data && (
          <Flex direction="column" mx="auto" gap="15px">
            {status.data.map((service: any, idx: number) => (
              <StatusRow key={idx} service={service} />
            ))}
          </Flex>
        )}
      </Layout>
    </>
  );
};

export default Status;
