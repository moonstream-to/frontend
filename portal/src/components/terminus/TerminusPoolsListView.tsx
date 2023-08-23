/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Flex,
  Image,
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
import useLink from "../../hooks/useLink";
import PoolDetailsRow from "../PoolDetailsRow";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

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

  const [newPoolURI, setNewPoolURI] = useState("");

  const headerMeta = ["name", "description", "image", "attributes"];

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
      poolURI,
    }: {
      capacity: string;
      isBurnable: boolean;
      isTransferable: boolean;
      poolURI: string;
    }) => {
      if (poolURI) {
        return terminusFacet.methods
          .createPoolV2(capacity, isTransferable, isBurnable, poolURI)
          .send({ from: web3ctx.account, maxPriorityFeePerGas: null, maxFeePerGas: null });
      }
      return terminusFacet.methods
        .createPoolV1(capacity, isTransferable, isBurnable)
        .send({ from: web3ctx.account, maxPriorityFeePerGas: null, maxFeePerGas: null });
    },
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
    if (newPoolURI) {
    }
    newPool.mutate({
      capacity: newPoolProps.capacity,
      isTransferable: newPoolProps.isTransferable,
      isBurnable: newPoolProps.isBurnable,
      poolURI: newPoolURI,
    });
  };

  const newMetadata = useLink({ link: newPoolURI });

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
        <ModalContent bg="#181818" color="white" border="1px solid white" minW="800px">
          <ModalHeader>New pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="700px">
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
            <Input
              value={newPoolURI}
              type="text"
              placeholder="poolURI"
              onChange={(e) => setNewPoolURI(e.target.value)}
              mt={4}
              mb={4}
            />
            {newMetadata.data && (
              <Accordion allowToggle mt={-4} mb={4}>
                <AccordionItem border="none">
                  <AccordionButton justifyContent="end">
                    Metadata preview
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Flex direction="column" gap="10px" borderRadius="10px" bg="#232323" p="20px">
                      {newMetadata.data?.name && (
                        <Text fontWeight="700" fontSize="24px" mb="20px">
                          {newMetadata.data.name}
                        </Text>
                      )}
                      {newMetadata.data?.image && (
                        <Image
                          w="140px"
                          h="140px"
                          borderRadius="20px"
                          src={newMetadata.data.image}
                          alt="image"
                        />
                      )}
                      {newMetadata.data?.description && (
                        <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                          {newMetadata.data.description}
                        </ReactMarkdown>
                      )}
                      <Text fontWeight="700" mt="20px">
                        Metadata:
                      </Text>
                      {Object.keys(newMetadata.data)
                        .filter((key) => !headerMeta.includes(key))
                        .map((key) => {
                          return (
                            <PoolDetailsRow
                              key={key}
                              ml="10px"
                              type={key}
                              value={String(newMetadata.data[key])}
                            />
                          );
                        })}
                      {newMetadata.data?.attributes && (
                        <>
                          <Text fontWeight="700" mt="20px">
                            Attributes:
                          </Text>

                          {newMetadata.data.attributes.map(
                            (attribute: { trait_type: string; value: string }) => (
                              <PoolDetailsRow
                                key={attribute.trait_type}
                                type={attribute.trait_type}
                                value={String(attribute.value)}
                                ml="10px"
                              />
                            ),
                          )}
                        </>
                      )}
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}
            {!newMetadata.data && newPoolURI && (
              <Text color="error.500" mb={4}>
                Can&apos;t fetch metadata
              </Text>
            )}
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
