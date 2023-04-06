import {
  Flex,
  Image,
  Text,
  useDisclosure,
  Modal,
  Center,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const TextWithPopup = ({
  text,
  image,
  title,
  shortCharCount,
}: {
  text: string
  title: string
  image?: string
  shortCharCount?: number
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const textCut = shortCharCount || 80

  return (
    <>
      <Text fontWeight="700" fontSize="18px" pb={4}>
        {title}
      </Text>
      <Center fontSize={"xs"}>
        <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
          {text.length > textCut ? text.slice(0, textCut) + " ... " : text}
        </ReactMarkdown>
      </Center>

      {text.length > textCut && (
        <Text
          w="fit-content"
          color="#F56646"
          fontWeight="700"
          fontSize="12px"
          onClick={onOpen}
          cursor="pointer"
        >
          Read More
        </Text>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg="#1A1D22"
          border="1px solid white"
          borderRadius="20px"
          textColor="white"
          mx="15px"
          maxW="500px"
        >
          <ModalHeader fontFamily="Space Grotesk" fontSize="18px" fontWeight="700">
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" px="10px" gap="20px" fontFamily="Space grotesk" fontSize="12px">
              {image && (
                <Center>
                  <Image
                    alt={"Stage Image"}
                    src={image}
                    border="1px solid 4d4d4d"
                    borderRadius="10px"
                    w="250px"
                    h="250px"
                  />
                </Center>
              )}
              <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                {text}
              </ReactMarkdown>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button bgColor="#4D4D4D" _hover={{ bg: "#5d5d5d" }} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TextWithPopup
