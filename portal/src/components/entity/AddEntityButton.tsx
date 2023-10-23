import { Flex, Spinner } from "@chakra-ui/react";
import { useAddEntity } from "../../hooks/useJournal";
import { ReactNode } from "react";

const AddEntityButton = ({
  address,
  secondaryFields,
  journalName,
  blockchain,
  children,
  ...props
}: {
  address: string;
  journalName: string;
  secondaryFields: any;
  blockchain: string;
  children: ReactNode;
  [x: string]: any;
}) => {
  const addEntity = useAddEntity();
  const handleSaveAddressClick = async () => {
    const title = prompt("Title: ");
    if (title) {
      addEntity.mutate({
        address,
        title,
        blockchain,
        journalName,
        secondaryFields,
      });
    }
  };
  return (
    <Flex
      onClick={handleSaveAddressClick}
      cursor={"pointer"}
      {...props}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {addEntity.isLoading ? <Spinner /> : children}
    </Flex>
  );
};

export default AddEntityButton;
