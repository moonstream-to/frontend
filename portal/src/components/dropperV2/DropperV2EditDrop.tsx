import useMoonToast from "../../hooks/useMoonToast";
import { Flex } from "@chakra-ui/react";
import { EditDropProps } from "../../types";
import DropperV2ChainDataEdit from "./DropperV2ChainDataEdit";
import { useEffect } from "react";

const DropperV2EditDrop = ({
  dropState,
  address,
  dropId,
}: {
  dropId: string;
  address: string;
  dropState: any;
}) => {
  const toast = useMoonToast();
  const handleError = (e: unknown) => {
    if (e instanceof Error) {
      toast(e.message, "error");
    } else {
      toast("An error occurred", "error");
    }
  };

  useEffect(() => {
    console.log(dropState);
  }, []);

  return (
    <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
      {/* <Flex justifyContent="end" mb="10px">
        <ActivateClaimButton dropState={{ id: dbData.claimUUID, active }} />
      </Flex> */}
      <DropperV2ChainDataEdit
        chainData={dropState}
        address={address}
        dropId={dropId}
        handleError={handleError}
      />
    </Flex>
  );
};

export default DropperV2EditDrop;
