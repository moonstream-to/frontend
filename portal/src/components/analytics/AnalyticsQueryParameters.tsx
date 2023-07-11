import { Box, Flex, Text } from "@chakra-ui/react";
import ParamInput from "../ParamInput";
import { QueryInterface } from "./AnalyticsSmartContractQueries";

const AnalyticsQueryParameters = ({
  params,
  setParam,
  query,
  abi,
}: {
  params: { key: string; value: string }[];
  setParam: (idx: number, key: string, value: string) => void;
  query: QueryInterface;
  abi: any;
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
          <ParamInput
            param={param}
            onChange={(newValue) => setParam(idx, "value", String(newValue))}
            query={query}
            abi={abi}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default AnalyticsQueryParameters;
