import { ReactNode } from "react";
import { Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { useCreateEntity } from "../../hooks/useJournal";
import Web3 from "web3";
import useMoonToast from "../../hooks/useMoonToast";
import SaveDialog from "../SaveDialog";

const AddEntityButton = ({
  address,
  title,
  blockchain,
  tags,
  secondaryFields,
  isDisabled,
  hint,
  children,
  ...props
}: {
  address: string;
  title?: string;
  blockchain: string;
  tags: string[];
  secondaryFields?: Record<string, string>;
  isDisabled?: boolean;
  hint?: string;
  children: ReactNode;
  [x: string]: any;
}) => {
  const addEntity = useCreateEntity();
  const web3 = new Web3();
  const toast = useMoonToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSaveAddressClick = async (title: string) => {
    onClose();
    if (!web3.utils.isAddress(address)) {
      toast("Not a web3 address", "error");
    } else {
      if (title) {
        addEntity.mutate({
          address,
          title,
          blockchain,
          tags,
          secondaryFields,
        });
      }
    }
  };
  return (
    <Flex
      onClick={onOpen}
      cursor={isDisabled ? "default" : "pointer"}
      {...props}
      alignItems={"center"}
      justifyContent={"center"}
      opacity={isDisabled ? "0.6" : "1"}
      title={hint ?? ""}
    >
      <SaveDialog
        message={"Give a name to the address"}
        defaultValue={title ?? ""}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSaveAddressClick}
      />
      {addEntity.isLoading ? <Spinner h={"15px"} w={"15px"} /> : children}
    </Flex>
  );
};

export default AddEntityButton;
