import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Text, Flex, Spinner } from "@chakra-ui/react";

import Layout from "../../src/components/layout";
import queryCacheProps from "../../src/hooks/hookCommon";
import useMoonToast from "../../src/hooks/useMoonToast";
import LayoutLanding from "../../src/components/layoutLanding";
import StatusRow from "../../src/components/Status/StatusRow";

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

  return (
    <>
      <LayoutLanding home={false} title="Moonstream: Status page">
        <Flex mx="auto" py="40px" direction="column" justifyContent="space-between" minW="700px">
          <Text fontSize="24px" fontWeight="700" mb="30px" textAlign="center">
            Status page
          </Text>
          {status.isLoading && <Spinner mx="auto" />}
          {status.data && (
            <Flex direction="column" w="100%" mx="auto" gap="15px">
              {status.data.map((service: any, idx: number) => (
                <StatusRow key={idx} service={service} />
              ))}
            </Flex>
          )}
        </Flex>
      </LayoutLanding>
    </>
  );
};

export default Status;
