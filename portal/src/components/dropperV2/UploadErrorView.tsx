import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import styles from "./UploadErrorView.module.css";
import ErrorOctagonIcon from "../icons/ErrorOctagonIcon";
import CloseModalIcon from "../icons/CloseModalIcon";

interface AddTagModalProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const UploadErrorView = ({
  isOpen,
  onClose,
  message,
  title = "File rejected",
}: AddTagModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <div className={styles.container}>
            <div className={styles.titleContainer}>
              <ErrorOctagonIcon />
              <div className={styles.title}>{title}</div>
              <CloseModalIcon onClick={onClose} cursor={"pointer"} />
            </div>
            <div className={styles.message}>{message}</div>
            <button className={styles.button} onClick={onClose}>
              OK
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadErrorView;
