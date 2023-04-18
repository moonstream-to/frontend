import { CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, Image, Input, Select, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import useQueryAPI from "../../contexts/QueryAPIContext";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";

const QueryAPINewContractView = () => {
  const toast = useMoonToast();
  const { types, setIsCreatingContract } = useQueryAPI();
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const createSubscription = useMutation(SubscriptionsService.createSubscription(), {
    onError: (error) => toast(error, "error"),
    onSuccess: () => {
      queryClient.invalidateQueries("subscriptions");
    },
    // onSuccess: (response) => {
    // subscriptionsCache.refetch();
    //   const { session_id: sessionId, session_url: sessionUrl } = response.data;
    //   if (sessionId) {
    //     stripe.redirectToCheckout({ sessionId });
    //   } else if (sessionUrl) {
    //     window.location = sessionUrl;
    //   }
    // },
  });

  // const;
  // const;
  return (
    <Flex
      direction="column"
      p="30px"
      gap="20px"
      borderRadius="20px"
      bg="#2d2d2d"
      w="100%"
      minH="100%"
      position="relative"
    >
      <Flex gap="20px" position="absolute" zIndex="2" bottom="15px" right="15px">
        <Button
          variant="cancelButton"
          onClick={() => {
            setIsCreatingContract(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="saveButton"
          onClick={() => {
            console.log({ type, address, label: title, color: "#000000" });
            createSubscription.mutate({ type, address, label: title, color: "#000000" });
          }}
        >
          Create
        </Button>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="10px">
        <Text fontSize="24px" fontWeight="700">
          Create contract
        </Text>
        <CloseIcon onClick={() => setIsCreatingContract(false)} cursor="pointer" />
      </Flex>
      <Text>Type</Text>
      <Select placeholder="Select type" value={type} onChange={(e) => setType(e.target.value)}>
        {types.map(({ id }: { id: string }) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </Select>
      <Text>Address</Text>
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        variant="address"
        w="100%"
      />
      <Text>Title</Text>
      <Input variant="address" w="100%" value={title} onChange={(e) => setTitle(e.target.value)} />
    </Flex>
  );
};

export default QueryAPINewContractView;
