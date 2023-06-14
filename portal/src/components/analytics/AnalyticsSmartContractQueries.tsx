import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { useState } from "react";

export interface QueryInterface {
  name: string;
  description: string;
}

const AnalyticsSmartContractQueries = ({
  queries,
  onChange,
  selectedIdx,
}: {
  queries: QueryInterface[];
  onChange: (queryIdx: number) => void;
  selectedIdx: number;
}) => {
  return (
    <Flex wrap="wrap" gap="15px" fontSize="14px">
      {queries.map((q, idx: number) => (
        <Box
          key={idx}
          bg={idx === selectedIdx ? "white" : "transparent"}
          color={idx === selectedIdx ? "#1A1D22" : "white"}
          onClick={() => onChange(idx)}
          borderRadius="100px"
          border="1px solid white"
          p="6px 15px"
          cursor={idx === selectedIdx ? "default" : "pointer"}
        >
          {q.name}
        </Box>
      ))}
    </Flex>
  );
};

export default AnalyticsSmartContractQueries;
