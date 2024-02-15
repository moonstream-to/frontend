/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { useMutation, useQueryClient } from "react-query";
import { CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton, Input, Spinner, Text, Textarea } from "@chakra-ui/react";
import Web3Context from "../../contexts/Web3Context/context";
import http from "../../utils/httpMoonstream";

const DropperV2RegisterContract = ({
  address,
  onClose,
}: {
  address: string;
  onClose: () => void;
}) => {
  const { targetChain } = useContext(Web3Context);

  const [showInvalid, setShowInvalid] = useState(false);

  const [imageURI, setImageURI] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const registerContract = () => {
    if (!targetChain)
      return new Promise((_, rej) => {
        rej(new Error("Target chain is not selected"));
      });
    const data = {
      blockchain: targetChain.name,
      address,
      contract_type: "dropper-v0.2.0",
      title,
      image_uri: imageURI,
      description: description,
    };
    return http({
      method: "POST",
      url: "https://engineapi.moonstream.to/metatx/contracts",
      data,
    });
  };
  const queryClient = useQueryClient();
  const addContract = useMutation(registerContract, {
    onSuccess: () => {
      queryClient.invalidateQueries("metatxContracts");
      onClose();
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.detail ?? error.message ?? "Error registring contract");
    },
  });

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
            placeholder="https://"
          />
        </Flex>
        <Flex direction="column" gap="10px">
          <Text variant="label">Description</Text>
          <Textarea
            fontSize="18px"
            bg="transparent"
            borderRadius="10px"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        {addContract.isError && (
          <Text textAlign="center" color="error.500">
            {errorMessage}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default DropperV2RegisterContract;
