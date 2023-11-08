import { Box, Flex, Spacer } from "@chakra-ui/react";

export interface QueryInterface {
  title: string;
  context_url: string;
  description: string;
  content: string;
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
            bg={idx === selectedIdx ? "#C5DDFC" : "#232323"}
            color={idx === selectedIdx ? "#1A1D22" : "white"}
            onClick={() => onChange(idx)}
            borderRadius="100px"
            p="6px 15px"
            cursor={idx === selectedIdx ? "default" : "pointer"}
            lineHeight={"normal"}
          >
            {q.title}
          </Box>
        ))}
      <Spacer />
    </Flex>
  );
};

export default AnalyticsSmartContractQueries;
