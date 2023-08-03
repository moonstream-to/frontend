import { useState } from "react";
import { useQueryClient } from "react-query";
import { Box, IconButton, Spinner, Button, Flex, Text } from "@chakra-ui/react";
import { AiOutlineUndo } from "react-icons/ai";

import TimestampInput from "../TimestampInput";
import { DropDBData } from "../../types";
import EditRow from "./EditRow";
import useValidation from "./useValidation";
import useMoonToast from "../../hooks/useMoonToast";
import { useClaimUpdate } from "./useClaimUpdate";

const dbKeys: (keyof DropDBData)[] = ["terminusAddress", "terminusPoolId", "deadline"];

const DBDataEditSection: React.FC<{
  dbData: DropDBData;
  handleError: (error: unknown) => void;
}> = ({ dbData, handleError }) => {
  const updateClaim = useClaimUpdate();
  const [isDBDataChanged, setIsDBDataChanged] = useState(false);
  const queryClient = useQueryClient();
  const toast = useMoonToast();
  const [newDBData, setNewDBData] = useState<DropDBData>({ ...dbData });
  const [childKey, setChildKey] = useState(Date.now());

  const { errors: validationErrors, validateDBData, isValid } = useValidation();

  const handleChangeDBData = <T extends keyof DropDBData>(key: T, value: DropDBData[T]) => {
    validateDBData(key, value);
    const updatedDBData = { ...newDBData, [key]: value };
    setNewDBData(updatedDBData);
    setIsDBDataChanged(dbKeys.some((k) => dbData[k] !== updatedDBData[k]));
  };

  const revertDBDataChanges = () => {
    setNewDBData({ ...dbData });
    setChildKey(Date.now());
    setIsDBDataChanged(false);
    dbKeys.forEach((k) => validateDBData(k, dbData[k]));
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
      {dbKeys.slice(0, 2).map((key) => (
        <EditRow
          key={key}
          title={`${key.charAt(0).toUpperCase() + key.slice(1)}:`}
          onChange={(e) => handleChangeDBData(key, e.target.value)}
          value={newDBData[key]}
          validationError={validationErrors[key]}
        />
      ))}
      <Flex justifyContent="space-between" alignItems="center">
        <Text>Deadline</Text>
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
          isDisabled={!isDBDataChanged || updateClaim.isLoading}
          onClick={revertDBDataChanges}
        />
        <Button
          variant="saveButton"
          alignSelf="end"
          mb="15px"
          w="200px"
          isDisabled={!isDBDataChanged || updateClaim.isLoading}
          onClick={handleSaveClick}
        >
          {updateClaim.isLoading ? <Spinner /> : "Save"}
        </Button>
      </Flex>
    </>
  );
};

export default DBDataEditSection;
