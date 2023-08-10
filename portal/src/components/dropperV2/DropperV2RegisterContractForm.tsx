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
import http from "../../utils/httpMoonstream";

const dropperAbi = require("../../web3/abi/DropperV2.json");

const DropperV2RegisterContract = ({
  address,
  onClose,
  refetch,
}: {
  address: string;
  onClose: () => void;
  refetch: any;
}) => {
  const { account, onConnectWalletClick, web3, targetChain } = useContext(Web3Context);

  const [showInvalid, setShowInvalid] = useState(false);

  const web3ctx = useContext(Web3Context);

  const [tokenType, setTokenType] = useState(1);
  const [imageURI, setImageURI] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const registerContract = () => {
    if (!targetChain) return;
    const data = {
      blockchain: targetChain.name,
      address,
      contract_type: "dropper-v0.2.0",
      title,
      image_uri: imageURI,
      desription: description,
    };
    console.log(data);
    // return http({
    //   method: "POST",
    //   url: "https://engineapi.moonstream.to/metatx/contracts",
    //   data,
    // });
  };

  const addContract = useMutation(registerContract, {
    onSuccess: () => {
      onClose();
    },
  });

  const toast = useMoonToast();

  const isInputsValid = () => {
    setShowInvalid(true);
    return !!title;
  };

  useEffect(() => {
    setShowInvalid(false);
  }, [title]);

  return (
    <Flex borderRadius="20px" bg="#2d2d2d" w="100%" minH="100%" direction="column" overflowY="auto">
      <Flex direction="column" p="30px" gap="20px" w="100%">
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="title"> Register contract</Text>
          <IconButton
            variant="transparent"
            aria-label="close"
            icon={<CloseIcon />}
            onClick={onClose}
          />
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">Title</Text>
          <Input
            variant="address"
            fontSize="18px"
            w="45ch"
            borderRadius="10px"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            borderColor={!showInvalid || !!title ? "white" : "error.500"}
            placeholder="title"
          />
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">Image uri</Text>
          <Input
            variant="address"
            fontSize="18px"
            w="45ch"
            borderRadius="10px"
            value={imageURI}
            onChange={(e) => setImageURI(e.target.value)}
            // borderColor={!showInvalid || isAuthorizationPoolIdValid ? "white" : "error.500"}
            placeholder="https://"
          />
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">Description</Text>
          <Textarea
            // variant="address"
            fontSize="18px"
            bg="transparent"
            // w="45ch"
            borderRadius="10px"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            // borderColor={!showInvalid || isAuthorizationPoolIdValid ? "white" : "error.500"}
          />
        </Flex>

        <Flex justifyContent="end" gap="20px">
          <Button variant="cancelButton" aria-label="close" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="saveButton" minW="220px" onClick={() => addContract.mutate()}>
            {!addContract.isLoading ? <Text>Register</Text> : <Spinner />}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DropperV2RegisterContract;
