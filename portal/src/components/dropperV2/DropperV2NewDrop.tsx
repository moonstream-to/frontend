/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { useMutation, useQueryClient } from "react-query";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
import PoolDetailsRow from "../PoolDetailsRow";
import useLink from "../../hooks/useLink";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { DropperState, SetDropperState } from "./DropperV2DropsListView";
import AddEntityButton from "../entity/AddEntityButton";
import { chainByChainId } from "../../contexts/Web3Context";
import { AiOutlineSave } from "react-icons/ai";
import EntitySelect from "../entity/EntitySelect";
import { useJournal } from "../../hooks/useJournal";

const dropperAbi = require("../../web3/abi/DropperV2.json");
const terminusAbi = require("../../web3/abi/MockTerminus.json");

interface DropperV2NewDropProps {
  address: string;
  state: DropperState;
  setState: SetDropperState;
  onClose: () => void;
}

const DropperV2NewDrop: React.FC<DropperV2NewDropProps> = ({
  address,
  state,
  setState,
  onClose,
}) => {
  const { web3 } = useContext(Web3Context);

  const [showInvalid, setShowInvalid] = useState(false);

  const queryClient = useQueryClient();
  const web3ctx = useContext(Web3Context);
  const tokens = useJournal({ tags: ["tokens"] });
  const terminusContracts = useJournal({ tags: ["terminusContracts"] });

  const headerMeta = ["name", "description", "image", "attributes"];

  const createDrop = ({
    tokenType,
    tokenAddress,
    tokenId,
    amount,
    authorizationTokenAddress,
    authorizationPoolId,
    uri,
  }: {
    tokenType: number;
    tokenAddress: string;
    tokenId: number;
    amount: number;
    authorizationTokenAddress: string;
    authorizationPoolId: number;
    uri: string;
  }) => {
    const dropperContract = new web3.eth.Contract(dropperAbi) as any;

    dropperContract.options.address = address ?? "";
    return dropperContract.methods
      .createDrop(
        tokenType,
        tokenAddress,
        tokenId,
        amount,
        authorizationTokenAddress,
        authorizationPoolId,
        uri,
      )
      .send({ from: web3ctx.account, maxPriorityFeePerGas: null, maxFeePerGas: null });
  };

  const createDropMutation = useMutation(createDrop, {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries("dropsList");
      queryClient.invalidateQueries("dropperContract");
    },
  });

  const toast = useMoonToast();

  const isInputsValid = () => {
    setShowInvalid(true);
    return (
      isTokenTypeValid &&
      isAmountValid &&
      isAuthorizationTokenAddressValid &&
      isTokenIdValid &&
      isAuthorizationPoolIdValid &&
      isTokenAddressValid
    );
  };
  const dropTypes = {
    ERC20: 20,
    ERC721: 721,
    ERC1155: 1155,
    "Mint Terminus": 1,
  };

  const dropTypesIds = [20, 721, 1155, 1];

  const isTokenTypeValid = dropTypesIds.includes(state.tokenType);
  const isAmountValid = !isNaN(Number(state.tokenId));
  const isAuthorizationTokenAddressValid = web3.utils.isAddress(state.authorizationTokenAddress);
  const isTokenIdValid = !isNaN(Number(state.tokenId));
  const isAuthorizationPoolIdValid = !isNaN(Number(state.tokenId)); //TODO Check with contract ?
  const isTokenAddressValid = web3.utils.isAddress(state.tokenAddress);
  const newMetadata = useLink({ link: state.uri });

  const handleSave = () => {
    if (isInputsValid()) {
      createDropMutation.mutate({
        tokenType: Number(state.tokenType),
        tokenAddress: state.tokenAddress,
        tokenId: Number(state.tokenId),
        amount: Number(state.amount),
        authorizationTokenAddress: state.authorizationTokenAddress,
        authorizationPoolId: Number(state.authorizationPoolId),
        uri: state.uri,
      });
    }
  };

  useEffect(() => {
    setShowInvalid(false);
  }, [state]);

  useEffect(() => {
    if (state.tokenType === dropTypes.ERC721) {
      setState((prevState) => ({ ...prevState, amount: "1" }));
    }
    if (state.tokenType === dropTypes.ERC721 || state.tokenType === dropTypes.ERC20) {
      setState((prevState) => ({ ...prevState, tokenId: "0" }));
    }
  });

  // If drop type is "Mint Terminus" (type 1), then we populate the Terminus pool URI into the URI field as a default.
  useEffect(() => {
    if (state.tokenType === 1) {
      if (web3.utils.isAddress(state.tokenAddress) && state.tokenId) {
        const terminusContract = new web3.eth.Contract(terminusAbi) as any;
        terminusContract.options.address = state.tokenAddress;
        terminusContract.methods
          .uri(state.tokenId)
          .call()
          .then((terminusPoolURI: string) => {
            if (terminusPoolURI) {
              setState((prevState) => ({ ...prevState, uri: terminusPoolURI }));
            }
          });
      }
    }
  }, [state.tokenType, state.tokenAddress, state.tokenId]);

  return (
    <Flex borderRadius="20px" bg="#2d2d2d" w="100%" minH="100%" direction="column" overflowY="auto">
      <Flex direction="column" p="30px" gap="20px" w="100%">
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="title"> New Drop</Text>
          <IconButton
            variant="transparent"
            aria-label="close"
            icon={<CloseIcon />}
            onClick={onClose}
          />
        </Flex>
        <Text variant="title3" mb="-15px">
          Token:
        </Text>
        <Flex gap="20px">
          <Flex direction="column" gap="10px">
            <Text variant="label">type</Text>
            <Select
              w="20ch"
              value={state.tokenType}
              onChange={(e) =>
                setState((prevState) => ({ ...prevState, tokenType: Number(e.target.value) }))
              }
            >
              {Object.keys(dropTypes).map((type) => (
                <option key={type} value={dropTypes[type as keyof typeof dropTypes]}>
                  {type}
                </option>
              ))}
            </Select>
          </Flex>
          <Flex direction="column" gap="10px">
            <Text variant="label">address</Text>
            <Flex gap={"10px"}>
              <Input
                variant="address"
                fontSize="18px"
                w="45ch"
                borderRadius="10px"
                value={state.tokenAddress}
                onChange={(e) =>
                  setState((prevState) => ({ ...prevState, tokenAddress: e.target.value }))
                }
                borderColor={!showInvalid || isTokenAddressValid ? "white" : "error.500"}
                placeholder="token address"
              />
              {!tokens.data?.entities.some((e) => e.address === state.tokenAddress) &&
                web3.utils.isAddress(state.tokenAddress) && (
                  <AddEntityButton
                    address={state.tokenAddress}
                    tags={["tokens"]}
                    blockchain={chainByChainId(web3ctx.chainId) ?? ""}
                    w={"40px"}
                    h={"40px"}
                  >
                    <AiOutlineSave />
                  </AddEntityButton>
                )}
              <EntitySelect
                tags={["tokens"]}
                onChange={(address) =>
                  setState((prevState) => ({ ...prevState, tokenAddress: address }))
                }
              >
                ...
              </EntitySelect>
            </Flex>
          </Flex>

          <Flex direction="column" gap="10px">
            <Text variant="label">Id</Text>
            <Input
              variant="address"
              fontSize="18px"
              w="8ch"
              borderRadius="10px"
              isDisabled={
                state.tokenType === dropTypes.ERC721 || state.tokenType === dropTypes.ERC20
              }
              value={state.tokenId}
              onChange={(e) => setState((prevState) => ({ ...prevState, tokenId: e.target.value }))}
              borderColor={!showInvalid || isTokenIdValid ? "white" : "error.500"}
              placeholder="token ID"
            />
          </Flex>
        </Flex>

        <Text variant="title3" mb="-15px" mt="10px">
          Authorization:
        </Text>
        <Flex gap="20px">
          <Flex direction="column" gap="10px">
            <Text variant="label">address</Text>
            <Flex gap={"10px"}>
              <Input
                variant="address"
                fontSize="18px"
                w="45ch"
                borderRadius="10px"
                value={state.authorizationTokenAddress}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    authorizationTokenAddress: e.target.value,
                  }))
                }
                borderColor={
                  !showInvalid || isAuthorizationTokenAddressValid ? "white" : "error.500"
                }
                placeholder="authorization token address"
              />
              {!terminusContracts.data?.entities.some(
                (e) => e.address === state.authorizationTokenAddress,
              ) &&
                web3.utils.isAddress(state.authorizationTokenAddress) && (
                  <AddEntityButton
                    address={state.authorizationTokenAddress}
                    tags={["tokens"]}
                    blockchain={chainByChainId(web3ctx.chainId) ?? ""}
                    w={"40px"}
                    h={"40px"}
                  >
                    <AiOutlineSave />
                  </AddEntityButton>
                )}
              <EntitySelect
                tags={["terminusContracts"]}
                onChange={(address) =>
                  setState((prevState) => ({ ...prevState, authorizationTokenAddress: address }))
                }
              >
                ...
              </EntitySelect>
            </Flex>
          </Flex>
          <Flex direction="column" gap="10px">
            <Text variant="label">pool Id</Text>
            <Input
              variant="address"
              fontSize="18px"
              w="8ch"
              borderRadius="10px"
              value={state.authorizationPoolId}
              onChange={(e) =>
                setState((prevState) => ({ ...prevState, authorizationPoolId: e.target.value }))
              }
              borderColor={!showInvalid || isAuthorizationPoolIdValid ? "white" : "error.500"}
              placeholder="pool Id"
            />
          </Flex>
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">Amount</Text>
          <Input
            variant="address"
            fontSize="18px"
            w="45ch"
            borderRadius="10px"
            value={state.amount}
            isDisabled={state.tokenType === dropTypes.ERC721}
            onChange={(e) => setState((prevState) => ({ ...prevState, amount: e.target.value }))}
            borderColor={!showInvalid || isAmountValid ? "white" : "error.500"}
            placeholder="amount"
          />
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">uri</Text>
          <Input
            variant="address"
            fontSize="18px"
            w="45ch"
            borderRadius="10px"
            value={state.uri}
            onChange={(e) => setState((prevState) => ({ ...prevState, uri: e.target.value }))}
            // borderColor={!showInvalid || isAuthorizationPoolIdValid ? "white" : "error.500"}
            placeholder="https://"
          />
        </Flex>
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
                  <Flex gap={"20px"}>
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
                      <Box maxW={"580px"}>
                        <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                          {newMetadata.data.description}
                        </ReactMarkdown>
                      </Box>
                    )}
                  </Flex>
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
        {!newMetadata.data && state.uri && (
          <Text color="error.500" mb={4}>
            Can&apos;t fetch metadata
          </Text>
        )}

        <Flex justifyContent="end" gap="20px">
          <Button variant="cancelButton" aria-label="close" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="saveButton" minW="220px" onClick={handleSave}>
            {!createDropMutation.isLoading ? <Text>Create</Text> : <Spinner />}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DropperV2NewDrop;
