import { useState, KeyboardEvent } from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTag: (tag: string) => void;
}

const AddTagModal = ({ isOpen, onClose, onAddTag }: AddTagModalProps) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    onAddTag(newTag);
    setNewTag("");
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="0" borderRadius="20px" bg="transparent">
        <ModalBody>
          <Flex
            direction="column"
            bgColor="#1A1D22"
            borderRadius="20px"
            gap="30px"
            p="30px"
            alignItems="center"
          >
            <Flex justifyContent="space-between" alignItems="center" w="100%">
              <Text fontSize="24px" fontWeight="700">
                Add tag
              </Text>
              <CloseIcon onClick={onClose} cursor="pointer" />
            </Flex>
            <Input
              type="text"
              variant="text"
              placeholder="Enter new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Flex justifyContent="end" mt="20px" gap="20px" w="100%">
              <Button variant="saveButton" onClick={handleAddTag}>
                Add
              </Button>
              <Button variant="cancelButton" onClick={onClose}>
                Cancel
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddTagModal;
