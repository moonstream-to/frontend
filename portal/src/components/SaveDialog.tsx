import { Flex, Modal, ModalContent, Text } from "@chakra-ui/react";
import styles from "./SaveDialog.module.css";
import { useEffect, useState } from "react";

const SaveDialog = ({
  message,
  defaultValue,
  isOpen,
  onClose,
  onSave,
}: {
  message: string;
  defaultValue: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
}) => {
  const [value, setValue] = useState(defaultValue ?? "");
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSave(value);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className={styles.container} bg="#1A1D22" minW={"fit-content"}>
        <Text className={styles.message}>{message}</Text>
        <input
          type={"text"}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Flex className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={() => onSave(value)}>
            Save
          </button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default SaveDialog;
