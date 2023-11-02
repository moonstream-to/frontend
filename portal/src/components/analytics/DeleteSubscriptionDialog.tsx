import { useMutation, useQueryClient } from "react-query";
import { SubscriptionsService } from "../../services";
import useMoonToast from "../../hooks/useMoonToast";
import useAnalytics from "../../contexts/AnalyticsContext";
import styles from "./DeleteSubscriptionDialog.module.css";
import { Flex, Modal, ModalContent, Text, Spinner } from "@chakra-ui/react";

const DeleteSubscriptionDialog = ({
  isOpen,
  onClose,
  contract,
}: {
  isOpen: boolean;
  onClose: () => void;
  contract: { label: string; id: string };
}) => {
  const toast = useMoonToast();
  const { setSelectedAddressId } = useAnalytics();
  const queryClient = useQueryClient();
  const deleteSubscription = useMutation(SubscriptionsService.deleteSubscription(), {
    onError: (error: Error) => toast(error.message, "error"),
    onSuccess: () => {
      setSelectedAddressId(0);
      queryClient.invalidateQueries("subscriptions"); //TODO direct update
      onClose();
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <Flex className={styles.container}>
          <Text className={styles.title}>Unwatch address?</Text>
          <Text className={styles.text}>
            Are you sure you want to unwatch{" "}
            <span style={{ fontWeight: "bold", display: "inline-block" }}>{contract.label}</span>?
            This will delete the address’s historical information.
          </Text>
          <Flex className={styles.buttons}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>

            <button
              className={styles.unwatchButton}
              onClick={() => deleteSubscription.mutate(contract.id)}
            >
              Unwatch
              {deleteSubscription.isLoading ? (
                <Spinner h={5} w={5} ml={"4px"} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M6.35156 8.25H18.3516"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.8516 8.25V17.4375C16.8516 18.0938 16.2087 18.75 15.5658 18.75H9.13728C8.49442 18.75 7.85156 18.0938 7.85156 17.4375V8.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.35156 8.25V6.75C9.35156 6 10.1016 5.25 10.8516 5.25H13.8516C14.6016 5.25 15.3516 6 15.3516 6.75V8.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.8516 11.25V15.75"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.8516 11.25V15.75"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default DeleteSubscriptionDialog;
