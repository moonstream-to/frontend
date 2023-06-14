import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Text,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewQueryRequest: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [problem, setProblem] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(query, problem, contact);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent p="0" borderRadius="20px" bg="transparent">
          <ModalBody bg="transparent">
            <Flex
              direction="column"
              bgColor="#1A1D22"
              borderRadius="20px"
              gap="30px"
              p="30px"
              alignItems="center"
              minW="500px"
            >
              <Flex justifyContent="space-between" w="100%">
                <Text fontSize="24px" fontWeight="700">
                  Query request
                </Text>
                <CloseIcon
                  cursor="pointer"
                  onClick={() => {
                    onClose();
                  }}
                />
              </Flex>
              <FormControl>
                <FormLabel fontSize="16px">What query are you missing?</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your request"
                  name="query"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </FormControl>

              <FormControl mt="-20px">
                <FormLabel>What problem would it solve for you?</FormLabel>
                <Textarea
                  placeholder="Enter description"
                  value={problem}
                  name="problem"
                  onChange={(event) => setProblem(event.target.value)}
                />
              </FormControl>
              <FormControl mt="-20px">
                <FormLabel>Email, discord or telegram*</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your contact"
                  name="contact"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                />
              </FormControl>
              <Button
                w="100%"
                h="54px"
                type="submit"
                variant="plainOrange"
                p="10px 30px"
                borderRadius="10px"
              >
                {isLoading ? <Spinner /> : <Text lineHeight="26px">Request new query</Text>}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default NewQueryRequest;
