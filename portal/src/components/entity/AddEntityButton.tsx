import { ReactNode } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { getEntityByAddress, useCreateEntity, useUpdateEntity } from "../../hooks/useJournal";
import Web3 from "web3";
import useMoonToast from "../../hooks/useMoonToast";

const AddEntityButton = ({
  address,
  secondaryFields,
  tags,
  blockchain,
  isDisabled,
  children,
  ...props
}: {
  address: string;
  tags: string[];
  secondaryFields?: Record<string, unknown>;
  blockchain: string;
  isDisabled?: boolean;
  children: ReactNode;
  [x: string]: any;
}) => {
  const addEntity = useCreateEntity();
  const updateEntity = useUpdateEntity();
  const web3 = new Web3();
  const toast = useMoonToast();
  const handleSaveAddressClick = async () => {
    if (!web3.utils.isAddress(address)) {
      toast("Not a web3 address", "error");
    } else {
      const title = prompt("Title: ");
      if (title) {
        const entity = await getEntityByAddress(address);
        const input = {
          address,
          title,
          blockchain,
          tags,
          secondaryFields,
        };
        if (entity) {
          updateEntity.mutate({ ...input, entity });
        } else {
          addEntity.mutate(input);
        }
      }
    }
  };
  return (
    <Flex
      onClick={handleSaveAddressClick}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      {...props}
      alignItems={"center"}
      justifyContent={"center"}
      opacity={isDisabled ? "0.6" : "1"}
    >
      {addEntity.isLoading || updateEntity.isLoading ? <Spinner h={"15px"} w={"15px"} /> : children}
    </Flex>
  );
};

export default AddEntityButton;
