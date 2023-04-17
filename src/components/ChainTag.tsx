import { Box } from "@chakra-ui/react";

const ChainTag = ({ name }: { name: string }) => {
  return (
    <Box
      p="4px 8px"
      w="fit-content"
      fontSize="12px"
      lineHeight="100%"
      fontWeight="500"
      color="#358BF5"
      bg="#1A1D22"
      borderRadius="30px"
      border="0.5px solid #358BF5"
    >
      {name}
    </Box>
  );
};

export default ChainTag;
