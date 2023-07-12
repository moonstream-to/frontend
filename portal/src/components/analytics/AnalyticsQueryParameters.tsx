import { Box, Flex, Text } from "@chakra-ui/react";
import ParamInput from "../ParamInput";
import { QueryInterface } from "./AnalyticsSmartContractQueries";

const AnalyticsQueryParameters = ({
  setValue,
  query,
  abi,
  fields,
  values,
}: {
  setValue: (idx: number, value: string) => void;
  query: QueryInterface;
  abi: any;
  fields: string[];
  values: string[];
}) => {
  return (
    <Flex direction="column" gap="10px">
      <Text variant="title3" mb="5px">
        Parameters
      </Text>
      {fields &&
        fields.map((field, idx: number) => (
          <Flex key={idx} gap="0px" minW="100%" alignItems="center" pr="1.5px">
            <Box
              bg="transparent"
              color="#94C2FA"
              fontFamily="Jet Brains Mono, monospace"
              p="7px 15px"
              fontSize="16px"
              minW="20ch"
            >
              {field}
            </Box>
            <ParamInput
              onChange={(newValue) => setValue(idx, String(newValue))}
              query={query}
              abi={abi}
              field={fields[idx]}
              value={values[idx]}
            />
          </Flex>
        ))}
    </Flex>
  );
};

export default AnalyticsQueryParameters;
