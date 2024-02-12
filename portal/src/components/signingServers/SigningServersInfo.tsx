import { useQuery } from "react-query";
import axios from "axios";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import PoolDetailsRow from "../PoolDetailsRow";
import React from "react";
import useUser from "../../contexts/UserContext";

const SigningServersInfo = () => {
  const { user } = useUser();
  const signingServer = useQuery(["signing_server", user], async () => {
    const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
    const authorization = token ? { Authorization: `Bearer ${token}` } : {};
    const moonstreamApplicationId = process.env.NEXT_PUBLIC_MOONSTREAM_APPLICATION_ID;

    const subdomains = await axios
      .get(
        `https://auth.bugout.dev/resources?application_id=${moonstreamApplicationId}&type=waggle-access`,
        {
          headers: {
            "Content-Type": "application/json",
            ...authorization,
          },
        },
      )
      .then((res) => {
        return res.data.resources
          .filter((r: any) => r.resource_data.type === "waggle-access")
          .map((r: any) => r.resource_data.customer_name);
      });

    const requests = subdomains.map((subdomain: string) => {
      return axios
        .get(`https://${subdomain}.waggle.moonstream.org/signers/`, {
          headers: {
            "Content-Type": "application/json",
            ...authorization,
          },
        })
        .then((res) => {
          return res.data.signers.map((s: string) => {
            return { subdomain: subdomain, address: s };
          });
        });
    });

    const signers = await Promise.allSettled(requests)
      .then((results) => {
        return results
          .filter(
            (res): res is PromiseFulfilledResult<{ subdomain: string; address: string }[]> =>
              res.status === "fulfilled",
          )
          .flatMap((result) => result.value);
      })
      .catch((error) => {
        console.error("Promise.allSettled catch", error);
      });
    const unavailableServers = subdomains.filter(
      (subdomain: string) =>
        !signers ||
        !signers.some((signer: { subdomain: string }) => signer.subdomain === subdomain),
    );
    if (!signers) {
      return { signers: [], unavailableServers };
    }

    return { signers, unavailableServers };
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
      {signingServer.isLoading && <Spinner />}

      {signingServer.data && (
        <Flex direction={"column"} gap={"20px"} w={"100%"}>
          {signingServer.data.signers.map(
            (item: { subdomain: string; address: string }, idx: number) => (
              <Flex direction={"column"} gap={"10px"} key={idx}>
                <PoolDetailsRow displayFull value={item.subdomain} type={"Server"} />
                <PoolDetailsRow displayFull value={item.address} type={"Account"} />
                <PoolDetailsRow displayFull value={"OK"} type={"Status"} />
              </Flex>
            ),
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default SigningServersInfo;
