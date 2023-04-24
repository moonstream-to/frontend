import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";
import useLogin from "../hooks/useLogin";
import { CloseIcon } from "@chakra-ui/icons";

import { AWS_ASSETS_PATH } from "../constants";

const icons = {
  logo: `${AWS_ASSETS_PATH}/icons/moon-logo.png`,
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignIn: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, data } = useLogin();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login({ username, password });
  };

  useEffect(() => {
    if (data) {
      onClose();
    }
  }, [data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent p="0" borderRadius="20px" bg="transparent">
          {/* <ModalHeader>Login</ModalHeader> */}
          <ModalBody bg="transparent">
            <Flex
              direction="column"
              bgColor="#1A1D22"
              borderRadius="20px"
              gap="30px"
              p="30px"
              alignItems="center"
            >
              <Flex justifyContent="end" w="100%">
                <CloseIcon
                  cursor="pointer"
                  onClick={() => {
                    onClose();
                  }}
                />
              </Flex>
              <Image alt="" src={icons.logo} w="55px" />
              <Text fontSize="30px" fontWeight="700">
                Welcome back!
              </Text>
              <FormControl>
                <FormLabel fontSize="16px">Username or email</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your username or email"
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </FormControl>

              <FormControl mt="-20px">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormControl>
              <Button w="100%" h="54px" type="submit" variant="plainOrange" p="10px 30px">
                {isLoading ? <Spinner /> : <Text lineHeight="26px">Login</Text>}
              </Button>
              <Flex
                mt="-20px"
                gap="5px"
                fontSize="16px"
                justifyContent="center"
                alignItems="center"
              >
                <Text>New&nbsp;to&nbsp;Moonstream?</Text>
                <Button variant="transparent" p="0" fontWeight="400" color="#F88F78">
                  Create an account
                </Button>
              </Flex>
            </Flex>
          </ModalBody>

          {/* <ModalFooter> */}
          {/* </ModalFooter> */}
        </ModalContent>
      </form>
    </Modal>
  );
};

export default SignIn;
