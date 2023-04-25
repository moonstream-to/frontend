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
import useSignUp from "../hooks/useSignUp";

const icons = {
  logo: `${AWS_ASSETS_PATH}/icons/moon-logo.png`,
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUp: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // const { login, isLoading, data } = useLogin();
  const { signUp, isLoading, isSuccess } = useSignUp();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signUp({ username, email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

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
                Welcome!
              </Text>
              <FormControl>
                <FormLabel fontSize="16px">Username</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </FormControl>
              <FormControl mt="-20px">
                <FormLabel fontSize="16px">Email</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </FormControl>

              <FormControl mt="-20px">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormControl>
              <Button w="100%" h="54px" type="submit" variant="plainOrange" p="10px 30px">
                {isLoading ? <Spinner /> : <Text lineHeight="26px">Create account</Text>}
              </Button>
            </Flex>
          </ModalBody>

          {/* <ModalFooter> */}
          {/* </ModalFooter> */}
        </ModalContent>
      </form>
    </Modal>
  );
};

export default SignUp;
