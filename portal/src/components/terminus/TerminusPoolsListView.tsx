/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import TerminusPoolsList from "./TerminusPoolsList";
import Web3Context from "../../contexts/Web3Context/context";
const terminusAbi = require("../../web3/abi/MockTerminus.json");
import { MockTerminus } from "../../web3/contracts/types/MockTerminus";
import { useRouter } from "next/router";
import { MAX_INT } from "../../constants";
import useTermiminus from "../../contexts/TerminusContext";

const TerminusPoolsListView = () => {
  const toast = useToast();
  const router = useRouter();

  const {
    contractAddress,
    contractState,
    setIsNewPoolCreated,
    setQueryPoolId,
    poolsFilter,
    setPoolsFilter,
  } = useTermiminus();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const web3ctx = useContext(Web3Context);
  const [newPoolProps, setNewPoolProps] = useState<{
    capacity: string;
    isTransferable: boolean;
    isBurnable: boolean;
  }>({ capacity: "", isTransferable: true, isBurnable: true });

  useEffect(() => {
    const queryPoolId =
      typeof router.query.poolId === "string" ? Number(router.query.poolId) : undefined;
    if (queryPoolId) {
      setQueryPoolId(queryPoolId);
    }
  }, [router.query.poolId]);

  const terminusFacet = new web3ctx.web3.eth.Contract(terminusAbi) as any as MockTerminus;
  terminusFacet.options.address = contractAddress;

  const commonProps = {
    onSuccess: () => {
      toast({
        title: "Successfully updated contract",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // contractState.refetch(); //TODO
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  };

  const queryClient = useQueryClient();
  const newPool = useMutation(
    ({
      capacity,
      isBurnable,
      isTransferable,
    }: {
      capacity: string;
      isBurnable: boolean;
      isTransferable: boolean;
    }) =>
      terminusFacet.methods
        .createPoolV1(capacity, isTransferable, isBurnable)
        .send({ from: web3ctx.account }),
    {
      ...commonProps,
      onSuccess: () => {
        setIsNewPoolCreated(true);
        queryClient.invalidateQueries("poolsList");
        queryClient.invalidateQueries("poolState");
        queryClient.invalidateQueries("contractState");
      },
    },
  );

  const createNewPool = () => {
    const capacity = Number(newPoolProps.capacity);

    if (
      !newPoolProps.capacity ||
      !Number(capacity) ||
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      onOpen();
      toast({
        title: "Capacity must be a positive number",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    newPool.mutate({
      capacity: newPoolProps.capacity,
      isTransferable: newPoolProps.isTransferable,
      isBurnable: newPoolProps.isBurnable,
    });
  };

  return (
    <Flex
      direction="column"
      bg="#2d2d2d"
      borderRadius="20px"
      gap="30px"
      p="30px"
      w="400px"
      maxH="700px"
      color="white"
    >
      <Text fontWeight="700" fontSize="24px">
        pools
      </Text>
      <Input
        value={poolsFilter}
        onChange={(e) => setPoolsFilter(e.target.value)}
        placeholder="search"
        borderRadius="10px"
        p="8px 15px"
      />

      <TerminusPoolsList />

      {contractState && contractState.controller === web3ctx.account && (
        <Button
          width="100%"
          bg="gray.0"
          fontWeight="700"
          fontSize="20px"
          color="#2d2d2d"
          onClick={onOpen}
          isDisabled={newPool.isLoading}
        >
          {newPool.isLoading ? <Spinner /> : "+ Add new"}
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#181818" color="white" border="1px solid white">
          <ModalHeader>New pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={3}>
              <Input
                onChange={(e) =>
                  setNewPoolProps((prev) => {
                    return { ...prev, capacity: e.target.value };
                  })
                }
                placeholder="capacity"
                type="number"
                value={newPoolProps.capacity}
                mb={4}
              />
              <Button
                colorScheme="purple"
                onClick={() => {
                  setNewPoolProps((prev) => {
                    return { ...prev, capacity: MAX_INT };
                  });
                }}
              >
                MAX_INT
              </Button>
            </Flex>
            <Checkbox
              colorScheme="white"
              mr={3}
              onChange={(e) =>
                setNewPoolProps((prev) => {
                  return { ...prev, isBurnable: e.target.checked };
                })
              }
              isChecked={newPoolProps.isBurnable}
            >
              Burnable
            </Checkbox>
            <Checkbox
              colorScheme="white"
              onChange={(e) =>
                setNewPoolProps((prevState) => {
                  return { ...prevState, isTransferable: e.target.checked };
                })
              }
              isChecked={newPoolProps.isTransferable}
            >
              Transferable
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="whiteAlpha" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                createNewPool();
                onClose();
              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TerminusPoolsListView;
