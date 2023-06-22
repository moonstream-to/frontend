import { Box, Flex, Spacer } from "@chakra-ui/react";

export interface QueryInterface {
  title: string;
  context_url: string;
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
    <Flex wrap="wrap" gap="15px" fontSize="14px" justifyContent="space-between">
      {queries &&
        queries.map((q, idx: number) => (
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
            {q.title}
          </Box>
        ))}
      <Spacer />
    </Flex>
  );
};

export default AnalyticsSmartContractQueries;
