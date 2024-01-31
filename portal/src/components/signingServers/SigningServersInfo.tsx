import { useQuery } from "react-query";
import axios from "axios";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import PoolDetailsRow from "../PoolDetailsRow";
import { formatDuration, timestampToHumanDate } from "../../utils/timeFormat";
import React from "react";

const SigningServersInfo = () => {
  const signingServers = useQuery(["nodeBalancerAccess"], () => {
    const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
    const authorization = token ? { Authorization: `Bearer ${token}` } : {};

    return axios
      .get("https://fullcount.waggle.moonstream.org/signers/", {
        headers: {
          "Content-Type": "application/json",
          ...authorization,
        },
      })
      .then((res) => {
        return res.data;
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
        Signing servers
      </Text>
      {signingServers.isLoading && <Spinner />}

      {signingServers.data && (
        <Flex direction={"column"} gap={"20px"} w={"100%"}>
          {signingServers.data.signers.map((item: string, idx: number) => (
            <Flex direction={"column"} gap={"10px"} key={idx}>
              <PoolDetailsRow displayFull value={item} type={"Account"} />
              <PoolDetailsRow displayFull value={"OK"} type={"Status"} />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default SigningServersInfo;
