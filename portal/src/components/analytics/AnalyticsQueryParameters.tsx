import { Box, Flex, Input, Text } from "@chakra-ui/react";
import Web3 from "web3";
import TimestampInput from "../TimestampInput";

const inputs = [
  "address",
  "event_name",
  "start_timestamp",
  "end_timestamp",
  "user_address",
  "start_block_number",
  "end_block_number",
  "blocks_back",
];

const isPositiveInteger = (value: string) => {
  const num = Number(value);
  if (!num && num != 0) {
    return false;
  }
  return num === Math.round(num) && num > -1;
};

const AnalyticsQueryParameters = ({
  params,
  setParam,
}: {
  params: { key: string; value: string }[];
  setParam: (idx: number, key: string, value: string) => void;
}) => {
  const web3 = new Web3();
  const isValid = (key: string, value: string, allowEmpty = true) => {
    if (!allowEmpty && value === "") return false;
    const validators = [
      web3.utils.isAddress,
      () => true,
      isPositiveInteger,
      isPositiveInteger,
      web3.utils.isAddress,
      isPositiveInteger,
      isPositiveInteger,
      isPositiveInteger,
    ]; //TODO make it map
    const validatorIdx = inputs.indexOf(key);
    if (validatorIdx > -1 && validatorIdx < validators.length) {
      return validators[validatorIdx](value);
    } else {
      return true;
    }
  };

  return (
    <Flex direction="column" gap="10px">
      <Text variant="title3" mb="5px">
        Parameters
      </Text>
      {params.map((param, idx: number) => (
        <Flex key={idx} gap="0px" minW="100%" alignItems="center" pr="1.5px">
          <Box
            bg="transparent"
            color="#94C2FA"
            fontFamily="Jet Brains Mono, monospace"
            // borderRadius="10px"
            // border="1px solid #4D4D4D"
            p="7px 15px"
            fontSize="16px"
            minW="20ch"
          >
            {param.key}
          </Box>
          {param.key?.includes("timestamp") ? (
            <TimestampInput
              timestamp={param.value ?? ""}
              setTimestamp={(newValue: string) => setParam(idx, "value", String(newValue))}
            />
          ) : (
            <Input
              flex="2"
              h="40px"
              variant="address"
              border="1px solid #4D4D4D"
              borderColor={
                isValid(param.key, param.value) || !param.value ? "#4d4d4d" : "error.500"
              }
              value={param.value}
              onChange={(e) => setParam(idx, "value", e.target.value)}
              mr="10px"
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
};

export default AnalyticsQueryParameters;
