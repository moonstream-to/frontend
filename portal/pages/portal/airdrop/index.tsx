/* eslint-disable @typescript-eslint/no-var-requires */
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { Button, Center, Flex, Input, Spacer, Text } from "@chakra-ui/react";

import Layout from "../../../src/components/layout";
import Spinner from "../../../src/components/Spinner/Spinner";
import Web3Context from "../../../src/contexts/Web3Context/context";
import { ENTITY_API } from "../../../src/constants";
import useMoonToast from "../../../src/hooks/useMoonToast";
import hookCommon from "../../../src/hooks/hookCommon";
import CollectionRow from "../../../src/components/CollectionRow";
import { ErrorAPI } from "../../../src/hooks/hookCommon";

const Airdrop = () => {
  const toast = useMoonToast();
  const [claimantAddress, setClaimantAddress] = useState("");
  const [claimantEmail, setClaimantEmail] = useState("");
  const [claimantDiscord, setClaimantDiscord] = useState("");
  const [claimantPassword, setClaimantPassword] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setCollectionId(typeof router.query.eventId === "string" ? router.query.eventId : "");
      setCollectionName(typeof router.query.name === "string" ? router.query.name : "");
    }
  }, [router.isReady, router.query]);

  const { web3 } = useContext(Web3Context);

  const onError = (error: { message: string }) => {
    toast(error?.message ?? "Error", "error", 5000);
  };

  const getCollections = async (userId: string) => {
    return axios
      .get(`${ENTITY_API}/public/collections?user_id=${userId}`)
      .then((res: any) => res.data?.collections);
  };

  function useCollections(userId: string) {
    return useQuery(["get_collections", userId], () => getCollections(userId), {
      ...hookCommon,
      onError: (e: Error) => onError(e),
    });
  }

  const events = useCollections(process.env.NEXT_PUBLIC_PUBLIC_USER_ETHDENVER_ID ?? "");

  const createPublicEntryMutation = useMutation(
    ({
      address,
      email,
      discord,
      password,
    }: {
      address: string;
      email: string;
      discord: string;
      password: string;
    }) => {
      return axios
        .get(
          `${ENTITY_API}/public/collections/${collectionId}/search?required_field=address:${address}`,
        )
        .then((res) => {
          if (res.data?.total_results >= 1) {
            return new Promise((_, reject) => {
              reject(new Error("already claimed"));
            });
          }

          const data = new FormData();
          data.append("address", address);
          data.append("blockchain", "polygon");
          data.append("name", "Public claimant protected");
          data.append("password", password);
          data.append("email", email);
          data.append("discord", discord);

          return axios.post(
            `${ENTITY_API}/public/collections/${collectionId}/entities/protected`,
            data,
          );
        });
    },
    {
      onError: (error: ErrorAPI) => {
        if (error?.request?.response) {
          try {
            const errorMsg = JSON.parse(error?.request?.response);
            onError({ message: errorMsg.detail });
          } catch {
            onError(error);
          }
        } else {
          onError(error);
        }
      },
      onSuccess: (data: any) =>
        toast(`succesfully claimed for ${data?.data?.address}`, "success", 5000),
    },
  );

  const handleSubmit = () => {
    if (
      claimantAddress === "" ||
      claimantEmail === "" ||
      claimantDiscord === "" ||
      claimantPassword === ""
    ) {
      onError({ message: "please fill all fields" });
      return;
    }
    if (!web3.utils.isAddress(claimantAddress)) {
      onError({ message: "address is not valid" });
      return;
    }
    createPublicEntryMutation.mutate({
      address: claimantAddress,
      email: claimantEmail,
      discord: claimantDiscord,
      password: claimantPassword,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Layout home={false}>
      <Flex px="7%" gap="40px" py="40px" direction="column" justifyContent="start" h="100%">
        <Text fontSize={["24px", "40px"]} color="white" fontWeight="700">
          {!collectionId ? `Claims` : `Claim  - ${collectionName ?? ""}`}
        </Text>
        {events.isLoading && <Spinner />}
        {collectionId && (
          <Center>
            <Flex fontSize="min(18px, 9px + 0.7vw)" direction="column" color="white">
              <Flex
                direction="column"
                p="calc(2vw)"
                minW="250px"
                gap="40px"
                borderRadius="10px"
                border="1px solid white"
              >
                <Flex direction="column" gap="10px">
                  <Text>Wallet address</Text>
                  <Input
                    variant="address"
                    onKeyDown={handleKeyDown}
                    placeholder="wallet address"
                    type="text"
                    value={claimantAddress}
                    onChange={(e) => {
                      setClaimantAddress(e.target.value);
                    }}
                  />
                  <Text>Email</Text>
                  <Input
                    onKeyDown={handleKeyDown}
                    variant="address"
                    placeholder="email"
                    type="email"
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                  />
                  <Text>Discord</Text>
                  <Input
                    onKeyDown={handleKeyDown}
                    variant="address"
                    placeholder="discord account"
                    type="text"
                    value={claimantDiscord}
                    onChange={(e) => setClaimantDiscord(e.target.value)}
                  />
                  <Text>Password</Text>
                  <Input
                    onKeyDown={handleKeyDown}
                    variant="address"
                    placeholder="password"
                    type="password"
                    value={claimantPassword}
                    onChange={(e) => setClaimantPassword(e.target.value)}
                  />
                </Flex>
                <Button
                  variant="plainOrange"
                  borderRadius="10px"
                  minW="100%"
                  bg="#F56646"
                  color="white"
                  onClick={handleSubmit}
                >
                  {createPublicEntryMutation.isLoading ? (
                    <Spinner h="22px" w="22px" />
                  ) : (
                    <Text>Claim</Text>
                  )}
                </Button>
              </Flex>
            </Flex>
          </Center>
        )}
        <>
          {!collectionId && events.data && (
            <Flex direction="column" gap="20px">
              {events.data.map((collection: { collection_id: string; name: string }) => (
                <CollectionRow collection={collection} key={collection.collection_id} />
              ))}
            </Flex>
          )}
        </>
        <Spacer />
      </Flex>
    </Layout>
  );
};

export default Airdrop;
