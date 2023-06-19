import { Box, Flex, Input, Text } from "@chakra-ui/react";
import TimestampInput from "../TimestampInput";
import { isValid } from "./validateParameters";

const AnalyticsQueryParameters = ({
  params,
  setParam,
}: {
  params: { key: string; value: string }[];
  setParam: (idx: number, key: string, value: string) => void;
}) => {
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
