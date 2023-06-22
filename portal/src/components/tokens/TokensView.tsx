import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { useMutation, useQueryClient } from "react-query";
import useUser from "../../contexts/UserContext";
import useMoonToast from "../../hooks/useMoonToast";
import { AuthService } from "../../services";

import TokensList from "./TokensList";

const TokensView = () => {
  const [newAPIKeyLabel, setNewAPIKeyLabel] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useUser();

  const {
    isOpen: isNewTokenOpen,
    onClose: onNewTokenClose,
    onOpen: onNewTokenOpen,
  } = useDisclosure();

  const toast = useMoonToast();
  const queryClient = useQueryClient();
  const createToken = useMutation(AuthService.login, {
    onSuccess: () => {
      toast("New token created", "success");
      queryClient.invalidateQueries("tokens");
      setNewAPIKeyLabel("");
      setPassword("");
      onNewTokenClose();
    },
    onError: (error: Error) => {
      toast(error.message, "error");
    },
  });

  useEffect(() => {
    setPassword("");
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createToken.mutate({ username: user.username, password, token_note: newAPIKeyLabel });
  };

  if (!user) {
    return <></>;
  }

  return (
    <Flex px="7%" py="30px" w="100%" userSelect="none">
      <Modal isOpen={isNewTokenOpen} onClose={onNewTokenClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent p="0" borderRadius="20px" bg="transparent">
            <ModalBody>
              <Flex
                direction="column"
                bgColor="#1A1D22"
                borderRadius="20px"
                gap="30px"
                p="30px"
                alignItems="center"
                w="600px"
              >
                <Flex justifyContent="space-between" alignItems="center" w="100%">
                  <Text fontSize="24px" fontWeight="700">
                    New API access token
                  </Text>
                  <CloseIcon onClick={onNewTokenClose} cursor="pointer" />
                </Flex>
                <Input
                  type="text"
                  placeholder="API token label (optional)"
                  name="label"
                  value={newAPIKeyLabel}
                  onChange={(e) => setNewAPIKeyLabel(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Flex justifyContent="end" mt="20px" gap="20px" w="100%">
                  <Button variant="saveButton" type="submit">
                    {createToken.isLoading ? <Spinner /> : "Create"}
                  </Button>
                  <Button variant="cancelButton" onClick={onNewTokenClose}>
                    Cancel
                  </Button>
                </Flex>
              </Flex>
            </ModalBody>
          </ModalContent>
        </form>
      </Modal>
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
      >
        <Flex justifyContent="space-between" w="100%" alignItems="center">
          <Text fontSize="24px" fontWeight="700">
            My API tokens
          </Text>
          <AiOutlinePlusCircle
            cursor="pointer"
            size="24"
            onClick={onNewTokenOpen}
            title="Add token"
          />
        </Flex>

        <TokensList />
      </Flex>
    </Flex>
  );
};

export default TokensView;
