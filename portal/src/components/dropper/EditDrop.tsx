import useMoonToast from "../../hooks/useMoonToast";
import { Flex } from "@chakra-ui/react";
import { EditDropProps } from "../../types";

import DBDataEditSection from "./DBDataEditSection";
import ChainDataEditSection from "./ChainDataEditSection";
import ActivateClaimButton from "./ActivateClaimButton";

const EditDrop: React.FC<EditDropProps> = ({ active, dbData, chainData, address, claimId }) => {
  const toast = useMoonToast();

  if (!dbData) return <></>;
  const handleError = (e: unknown) => {
    if (e instanceof Error) {
      toast(e.message, "error");
    } else {
      toast("An error occurred", "error");
    }
  };

  return (
    <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
      <Flex justifyContent="end" mb="10px">
        <ActivateClaimButton dropState={{ id: dbData.claimUUID, active }} />
      </Flex>
      <DBDataEditSection dbData={dbData} handleError={handleError} />
      <ChainDataEditSection
        chainData={chainData}
        address={address}
        claimId={claimId}
        handleError={handleError}
      />
    </Flex>
  );
};

export default EditDrop;
