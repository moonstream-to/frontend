import React, { useState } from "react";
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
} from "@chakra-ui/react";
import useLogin from "../hooks/useLogin";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent bg="black">
          <ModalHeader>Login</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                type="text"
                placeholder="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Login</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default SignIn;
