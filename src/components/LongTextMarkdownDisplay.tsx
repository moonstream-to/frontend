import React from "react";

import { 
  Flex,
  Center,
  Text,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@chakra-ui/react";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
      
const LongTextMarkdownDisplay = ({
  longTextMarkdown,
  header
}: {
  longTextMarkdown: string;
  header: string;
}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex flexDir="column">
      <Text fontSize="m" maxH="120px" overflow="hidden">{longTextMarkdown}</Text>
      <Center>
        <Text fontSize="sm" color="#8ab4f8" onClick={onOpen}>read more...</Text>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent
          bg="#1A1D22"
          border="1px solid white"
          borderRadius="20px"
          textColor="white"
        >
          <ModalHeader>{header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>
              {longTextMarkdown}
            </ReactMarkdown>
          </ModalBody>
          <ModalFooter>
            <Button bgColor="#4D4D4D" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default LongTextMarkdownDisplay;