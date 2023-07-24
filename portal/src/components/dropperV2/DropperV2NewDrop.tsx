/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Collapse,
  Flex,
  IconButton,
  Image,
  Input,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
import PoolDetailsRow from "../PoolDetailsRow";
import useLink from "../../hooks/useLink";

const dropperAbi = require("../../web3/abi/DropperV2.json");

const DropperV2NewDrop = ({ address, onClose }: { address: string; onClose: () => void }) => {
  const { account, onConnectWalletClick, web3 } = useContext(Web3Context);

  const [showInvalid, setShowInvalid] = useState(false);

  const queryClient = useQueryClient();
  const web3ctx = useContext(Web3Context);

  const [tokenType, setTokenType] = useState(1);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");
  const [authorizationTokenAddress, setAuthorizationTokenAddress] = useState("");
  const [authorizationPoolId, setAuthorizationPoolId] = useState("");
  const [uri, setUri] = useState("");
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
      .send({ from: web3ctx.account });
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

  const isTokenTypeValid = dropTypesIds.includes(tokenType);
  const isAmountValid = !isNaN(Number(tokenId));
  const isAuthorizationTokenAddressValid = web3.utils.isAddress(authorizationTokenAddress);
  const isTokenIdValid = !isNaN(Number(tokenId));
  const isAuthorizationPoolIdValid = !isNaN(Number(tokenId)); //TODO Check with contract ?
  const isTokenAddressValid = web3.utils.isAddress(tokenAddress);
  const newMetadata = useLink({ link: uri });

  const handleSave = () => {
    if (isInputsValid()) {
      createDropMutation.mutate({
        tokenType: Number(tokenType),
        tokenAddress,
        tokenId: Number(tokenId),
        amount: Number(amount),
        authorizationTokenAddress,
        authorizationPoolId: Number(authorizationPoolId),
        uri,
      });
    }
  };
  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  useEffect(() => {
    setShowInvalid(false);
  }, [tokenType, tokenAddress, tokenId, amount, authorizationTokenAddress, authorizationPoolId]);

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
            <Select w="20ch" value={tokenType} onChange={(e) => setTokenType(e.target.value)}>
              {Object.keys(dropTypes).map((type) => (
                <option key={type} value={dropTypes[type as keyof typeof dropTypes]}>
                  {type}
                </option>
              ))}
            </Select>
          </Flex>
          <Flex direction="column" gap="10px">
            <Text variant="label">address</Text>
            <Input
              variant="address"
              fontSize="18px"
              w="45ch"
              borderRadius="10px"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              borderColor={!showInvalid || isTokenAddressValid ? "white" : "error.500"}
              placeholder="token address"
            />
          </Flex>
          <Flex direction="column" gap="10px">
            <Text variant="label">Id</Text>
            <Input
              variant="address"
              fontSize="18px"
              w="8ch"
              borderRadius="10px"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
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
            <Input
              variant="address"
              fontSize="18px"
              w="45ch"
              borderRadius="10px"
              value={authorizationTokenAddress}
              onChange={(e) => setAuthorizationTokenAddress(e.target.value)}
              borderColor={!showInvalid || isAuthorizationTokenAddressValid ? "white" : "error.500"}
              placeholder="authorization token address"
            />
          </Flex>
          <Flex direction="column" gap="10px">
            <Text variant="label">pool Id</Text>
            <Input
              variant="address"
              fontSize="18px"
              w="8ch"
              borderRadius="10px"
              value={authorizationPoolId}
              onChange={(e) => setAuthorizationPoolId(e.target.value)}
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            value={uri}
            onChange={(e) => setUri(e.target.value)}
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
                    <Text fontWeight="400" fontSize="18px" mb="20px">
                      {newMetadata.data.description}
                    </Text>
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
        {!newMetadata.data && uri && (
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
