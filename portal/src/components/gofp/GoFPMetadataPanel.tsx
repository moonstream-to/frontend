import React, { useContext } from "react";

import {
  Flex,
  Box,
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
  useDisclosure,
} from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import useGofp from "../../contexts/GoFPContext";
import useGofpContract from "../../hooks/useGofpConract";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const MetadataPanel = () => {
  const web3ctx = useContext(Web3Context);
  const { sessionId, selectedStage, selectedPath, gardenContractAddress } = useGofp();
  const { sessionMetadata, currentStage } = useGofpContract({
    sessionId,
    gardenContractAddress,
    web3ctx,
  });

  const stage = sessionMetadata.data?.stages[selectedStage - 1];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const showAllPaths = selectedStage != currentStage.data || selectedPath < 1;

  return (
    <>
      {stage && (
        <Flex
          backgroundColor="#353535"
          border="4px solid white"
          borderRadius="20px"
          w="400px"
          px={4}
          flexDirection="column"
        >
          <Text fontSize="md" fontWeight="semibold" pt={6}>
            Stage {selectedStage}
          </Text>
          <Text fontSize="md" fontWeight="bold" pt={4}>
            {stage.title}
          </Text>
          <Flex
            borderWidth="2px"
            borderColor="#BFBFBF"
            borderRadius="10px"
            mt={6}
            p={2}
            flexDir="column"
          >
            <Text fontSize="m" maxH="120px" overflow="hidden">
              {stage.lore}
            </Text>
            <Center>
              <Text fontSize="sm" color="#8ab4f8" onClick={onOpen}>
                read more...
              </Text>
            </Center>
            <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
              <ModalOverlay />
              <ModalContent
                bg="#2D2D2D"
                border="1px solid white"
                borderRadius="20px"
                textColor="white"
              >
                <ModalHeader>{stage.title}</ModalHeader>
                <ModalCloseButton pl={3} />
                <ModalBody fontFamily="Lora">
                  <Flex flexDir="column">
                    {stage.imageUrl.length > 0 && (
                      <Center pb={6}>
                        <Image h="240px" alt={"Stage Image"} src={stage.imageUrl} />
                      </Center>
                    )}
                    <Flex
                      textColor="white"
                      fontFamily="Lora"
                      fontSize="14px"
                      fontWeight="700"
                      lineHeight="160%"
                    >
                      <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {stage.lore}
                      </ReactMarkdown>
                    </Flex>
                  </Flex>
                </ModalBody>
                <ModalFooter>
                  <Button bgColor="#4D4D4D" w="100%" h="20px" rounded="20px" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
          {stage.imageUrl.length > 0 && (
            <Center>
              <Image alt={"Stage " + selectedStage} h="100px" src={stage.imageUrl} pt={6} />
            </Center>
          )}
          <Flex flexDirection="column" mb={10}>
            {showAllPaths &&
              stage.paths.map((path, pathIdx) => {
                return (
                  <Flex
                    key={pathIdx}
                    borderWidth="2px"
                    borderColor="#BFBFBF"
                    borderRadius="10px"
                    mt={6}
                    flexDirection="column"
                  >
                    <Text fontWeight="semibold" p={2}>
                      Path {pathIdx + 1} - {path.title}
                    </Text>
                    <Box p={2}>
                      <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                        {path.lore}
                      </ReactMarkdown>
                    </Box>
                  </Flex>
                );
              })}
            {!showAllPaths && (
              <Flex
                borderWidth="2px"
                borderColor="#BFBFBF"
                borderRadius="10px"
                mt={6}
                flexDirection="column"
              >
                <Text fontWeight="semibold" p={2}>
                  Path {selectedPath} - {stage.paths[selectedPath - 1].title}
                </Text>
                <Box p={2}>
                  <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                    {stage.paths[selectedPath - 1].lore}
                  </ReactMarkdown>
                </Box>
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default MetadataPanel;
