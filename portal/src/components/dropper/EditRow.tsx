import React from "react";
import { Flex, Input, Text } from "@chakra-ui/react";

type EditRowProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  value: string | boolean;
  validationError: string;
};

const EditRow: React.FC<EditRowProps> = ({ title, onChange, value, validationError }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" gap="5px">
      <Text whiteSpace="nowrap">{title}</Text>
      <Input
        w="50ch"
        fontSize="16px"
        type="text"
        variant="address"
        value={String(value)}
        onChange={onChange}
        borderColor={!validationError || !value ? "#4d4d4d" : "error.500"}
      />
    </Flex>
  );
};

export default EditRow;
