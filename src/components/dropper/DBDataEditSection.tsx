import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { Box, IconButton, Spinner, Button, Flex, Text } from "@chakra-ui/react";
import { AiOutlineUndo } from "react-icons/ai";

import TimestampInput from "../TimestampInput";
import { DropDBData } from "../../types";
import EditRow from "./EditRow";
import useValidation from "./useValidation";
import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
import { useClaimUpdate } from "./useClaimUpdate";

const dbKeys = ["terminusAddress", "terminusPoolId", "deadline"];

const DBDataEditSection: React.FC<{
  dbData: DropDBData;
  handleError: (error: unknown) => void;
}> = ({ dbData, handleError }) => {
  const updateClaim = useClaimUpdate();
  const [isDBDataChanged, setIsDBDataChanged] = useState(false);
  const queryClient = useQueryClient();
  const toast = useMoonToast();
  const [newDBData, setNewDBData] = useState<DropDBData>(dbData);
  const ctx = useContext(Web3Context);
  const [childKey, setChildKey] = useState(Date.now());

  const { errors: validationErrors, validateDBData, isValid } = useValidation(ctx);

  const handleChangeDBData = <T extends keyof DropDBData>(key: T, value: DropDBData[T]) => {
    validateDBData(key, value);
    const newDBDataTemp = { ...newDBData, [key]: value };
    setNewDBData(newDBDataTemp);
    setIsDBDataChanged(
      Object.keys(dbData).some(
        (k) => dbData[k as keyof DropDBData] !== newDBDataTemp[k as keyof DropDBData],
      ),
    );
  };

  const revertDBDataChanges = () => {
    setNewDBData(dbData);
    setChildKey(Date.now());
    setIsDBDataChanged(false);
    (dbKeys as Array<keyof DropDBData>).forEach((k) => validateDBData(k, dbData[k]));
  };

  const handleSaveClick = () => {
    if (!isValid(dbKeys)) return;
    updateClaim.mutate(newDBData, {
      onSuccess: () => {
        queryClient.invalidateQueries("claimAdmin");
        setIsDBDataChanged(false);
        toast("Updated drop info", "success");
      },
      onError: handleError,
    });
  };

  return (
    <>
      <EditRow
        title="Terminus address:"
        onChange={(e) => handleChangeDBData("terminusAddress", e.target.value)}
        value={newDBData.terminusAddress}
        validationError={validationErrors["terminusAddress"]}
      />
      <EditRow
        title="Terminus pool ID:"
        onChange={(e) => handleChangeDBData("terminusPoolId", e.target.value)}
        value={newDBData.terminusPoolId}
        validationError={validationErrors["terminusPoolId"]}
      />
      <Flex justifyContent="space-between" alignItems="center">
        <Text>deadline</Text>
        <Box w="50ch">
          <TimestampInput
            key={childKey}
            timestamp={newDBData.deadline}
            setTimestamp={(newValue: string) => handleChangeDBData("deadline", String(newValue))}
          />
        </Box>
      </Flex>
      <Flex justifyContent="end" gap="15px" alignItems="center">
        <IconButton
          aria-label=""
          icon={<AiOutlineUndo />}
          variant="cancelButton"
          mb="15px"
          disabled={!isDBDataChanged || updateClaim.isLoading}
          onClick={revertDBDataChanges}
        />
        <Button
          variant="saveButton"
          alignSelf="end"
          mb="15px"
          w="200px"
          disabled={!isDBDataChanged || updateClaim.isLoading}
          onClick={handleSaveClick}
        >
          {updateClaim.isLoading ? <Spinner /> : "Save"}
        </Button>
      </Flex>
    </>
  );
};

export default DBDataEditSection;
